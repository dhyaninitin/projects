const userSchema = require("../schema/users.schema");
const workStatusSchema = require("../schema/work_status.schema");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const config = process.env;
const adminSchema = require("../schema/admin_users.schema");
const jwt = require("jsonwebtoken");
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
const azure = require("azure-storage");
const moment = require('moment');
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const containerName = "vv-tracker";
const AZURE_STORAGE_ACCOUNT = "vvtstorage";
const AZURE_STORAGE_ACCESS_KEY =
  "Kga9ssziX/FFFGRTGGerefdfs/DRwdBm+4rerferWToWCzeZlgdOfbfZ+AStqJbCcw==";
const CONNECTION_STRING = `DefaultEndpointsProtocol=https;AccountName=${AZURE_STORAGE_ACCOUNT};AccountKey=${AZURE_STORAGE_ACCESS_KEY};EndpointSuffix=core.windows.net`;

const sharedKeyCredential = new StorageSharedKeyCredential(
  AZURE_STORAGE_ACCOUNT,
  AZURE_STORAGE_ACCESS_KEY
);
const blobServiceClient = new BlobServiceClient(
  `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
  sharedKeyCredential
);

const genUrl = require("../../generateViewUrlOfBlob");
const otpViaEmailModel = require("../schema/check_otp_schema");
const logController = require("./logs-controller");
const logSchema = require("../schema/logs-schema");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL,
    pass: config.PASSWORD,
  },
});

function generateRandomOtp(length) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }
  return otp;
}

function generateRandomPassword(length) {
  const uppercaseCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseCharset = "abcdefghijklmnopqrstuvwxyz";
  const numberCharset = "0123456789";
  const specialCharset = "!@$%&*";

  let password = "";

  // Generate at least one character from each character set
  password += getRandomCharacterFromCharset(uppercaseCharset);
  password += getRandomCharacterFromCharset(lowercaseCharset);
  password += getRandomCharacterFromCharset(numberCharset);
  password += getRandomCharacterFromCharset(specialCharset);

  // Generate remaining characters
  for (let i = 4; i < length; i++) {
    const randomCharset = Math.floor(Math.random() * 4);
    switch (randomCharset) {
      case 0:
        password += getRandomCharacterFromCharset(uppercaseCharset);
        break;
      case 1:
        password += getRandomCharacterFromCharset(lowercaseCharset);
        break;
      case 2:
        password += getRandomCharacterFromCharset(numberCharset);
        break;
      case 3:
        password += getRandomCharacterFromCharset(specialCharset);
        break;
      default:
        break;
    }
  }

  return password;
}

function getRandomCharacterFromCharset(charset) {
  const randomIndex = Math.floor(Math.random() * charset.length);
  return charset[randomIndex];
}

// ADD USER API's
const addUser = async (req, res) => {
  try {
    const isExist = await userSchema.countDocuments({
      email: req.body.email,
      isdeleted: 0,
    });
    if (isExist >= 1) {
      res.status(409).json({ message: "User already exists" });
    } else {
      const newUser = new userSchema({
        empid: req.body.empid,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: "",
        phone: req.body.phone,
        status: 0,
        togglestatus: 0,
        isdeleted: 0,
        isnotificationallowed: 1,
        organizationname: req.body.organizationname,
        assignedhours: req.body.assignedhours,
        assigneddays: req.body.assigneddays,
        createdby: req.params.id,
        createdat: new Date(),
        jwttoken: "",
        tokengeneratedat: ""
      });

      const savedUser = await newUser.save();

      if (savedUser) {
        const adminDetails = await adminSchema.findById(req.params.id);

        const userDetails = {
          firstname: savedUser.firstname,
          lastname: savedUser.lastname,
          adminFirstName: adminDetails.firstname,
          adminLastName: adminDetails.lastname
        };

        logController.createAddLog('users_tbls', savedUser._id, req.params.id, userDetails, 'user');

        res.status(200).json({
          message: "User added Successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const sendDetailsToUserViaEmail = async (req, res) => {
  try {
    const randomPassword = generateRandomPassword(8);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(randomPassword, salt);
    await userSchema.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          password: hash,
        },
      },
      { new: true }
    );
    let mailDetails = {
      from: config.EMAIL,
      to: req.body.email,
      subject: `Your login details for VV-WST`,
      html: `Email: ${req.body.email} <br> Password: ${randomPassword} <br> VV-WST Setup - <a href="https://github.com/virtuevise/vv-tracker-setup/releases">click here</a>`,
    };

    await mailTransporter.sendMail(mailDetails);

    logController.createSendEmailLog('users_tbls', req.params.adminId, req.params.id);

    res.status(200).json({
      message: "Email Sent To User Successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getUser = async (req, res) => {
  try {
    const { page, limit, search, orderBy, orderDir } = req.query;
    const size = parseInt(limit);
    const skip = (page - 1) * size;
    const filter = { isdeleted: 0 };
    if (search) {
      filter.$or =
        [
          { empid: { $regex: search, $options: "i" } },
          { firstname: { $regex: search, $options: "i" } },
          { lastname: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ];
    }

    const sort = {};
    if (orderBy) {
      sort[orderBy] = orderDir === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    let users = await userSchema.find(filter).sort(sort).limit(size).skip(skip);
    let totalDataCount = await userSchema.countDocuments(filter);

    res.status(200).json({
      data: users,
      totalDataCount: totalDataCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUser = async (req, res) => {
  try {
    const existingUser = await userSchema.findById(req.params.id);
    const prevName = `${existingUser.firstname} ${existingUser.lastname}`;

    const updatedFields = {
      empid: req.body.empid,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      organizationname: req.body.organizationname,
      assignedhours: req.body.assignedhours,
      assigneddays: req.body.assigneddays,
      status: req.body.status,
      updateat: new Date(),
      updatedby: req.params.adminId,
    };

    const changes = {};
    for (const [key, value] of Object.entries(updatedFields)) {
      if (JSON.stringify(value) !== JSON.stringify(existingUser[key])) {
        changes[key] = { oldValue: existingUser[key], newValue: value };
      }
    }

    const updateUser = await userSchema.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updatedFields },
      { new: true }
    );

    const filteredChanges = Object.keys(changes).reduce((acc, key) => {
      if (changes[key].oldValue !== undefined) {
        acc[key] = changes[key];
      }
      return acc;
    }, {});

    logController.createUpdateLog('users_tbls', req.params.id, req.params.adminId, filteredChanges, prevName);

    if (updateUser) {
      res.status(200).json({
        message: 'User updated Successfully',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const logoutUser = async (req, res) => {
  try {
    await userSchema.findById(req.body.id);
    const updatedFields = {
      togglestatus: 0,
      jwttoken: "",
      updateat: new Date(),
      updatedby: req.body.admin,
      loggedoutbyadmin: 1
    };

    const updateUser = await userSchema.findByIdAndUpdate(
      { _id: req.body.id },
      { $set: updatedFields },
      { new: true }
    );

    if (updateUser) {
    logController.createUserLogoutLog('users_tbls', req.body.id,  req.body.admin,);
      res.status(200).json({
        message: 'User will be logged out shortly.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const ids = req.query.Ids.split(",").map((id) => id.trim());

    const getUserDetails = async (ids) => {
      try {
        const users = await userSchema.find({ _id: { $in: ids } }, 'firstname lastname status');

        return users;
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    const userDetails = await getUserDetails(ids);

    const deleteUsers = await userSchema.updateMany(
      { _id: { $in: ids } },
      { isdeleted: 1 }
    );

    if (deleteUsers && userDetails.length > 0) {
      logController.createDeleteLog('users_tbls', ids, req.params.adminId, userDetails);

      if (ids.length === 1) {
        res.status(200).json({
          message: `User deleted`,
        });
      } else {
        res.status(200).json({
          message: `Users deleted`,
        });
      }
    } else {
      res.status(404).json({
        message: "No users found for deletion",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const exportFromTo = async (req, res) => {
  try {
    const { from, to } = req.body;
    const userDocuments = await workStatusSchema
      .find({
        createdat: {
          $gte: from,
          $lt: to,
        },
      })
      .sort({ createdat: -1 });
    let idGroups = {};
    for (let item of userDocuments) {
      let userid = item.userid;
      if (!idGroups[userid]) {
        idGroups[userid] = [];
      }
      idGroups[userid].push(item);
    }
    let result = Object.values(idGroups);
    let sortedData = [];
    result.map((data) => {
      data.sort((a, b) => new Date(a.createdat) - new Date(b.createdat));
      function groupIntoWeeks(data) {
        const weeks = [];
        let currentWeek = [];
        let currentMonday = null;
        for (const item of data) {
          const itemDate = new Date(item.createdat);
          if (currentMonday === null) {
            currentMonday = new Date(itemDate);
            currentMonday.setDate(
              currentMonday.getDate() - ((currentMonday.getDay() + 6) % 7)
            );
          }
          if (
            itemDate >= currentMonday &&
            itemDate <=
            new Date(currentMonday).setDate(currentMonday.getDate() + 6)
          ) {
            currentWeek.push(item);
          } else {
            weeks.push(currentWeek);
            currentWeek = [item];
            currentMonday = new Date(itemDate);
            currentMonday.setDate(
              currentMonday.getDate() - ((currentMonday.getDay() + 6) % 7)
            );
          }
        }

        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        return weeks;
      }
      const weeks = groupIntoWeeks(data);
      sortedData.push(weeks);
    });

    const jsonCreated = [];
    (async () => {
      for (const element of sortedData) {
        const obj = await processElement(element);
        jsonCreated.push(obj);
      }
      createExcel(req, res, jsonCreated, from, to);
    })();

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function processElement(element) {
  let totalAssignedHours = 0;
  let count = 0;
  let userId;
  let mouseClicks = 0;
  let keyPress = 0;
  for (const item of element) {
    let items = JSON.parse(JSON.stringify(item));
    userId = item[0].userid;
    count += item.length;
    totalAssignedHours += items[0].assignedhours;
    for (const data of item) {
      mouseClicks += data.mouseclicks;
      keyPress += data.keypresses;
    }
  }
  let user = await userSchema.findOne({ _id: userId });
  let obj = {
    Emp_ID: user?.empid,
    Name: user?.firstname + " " + user?.lastname,
    Email: user?.email,
    Phone: user?.phone,
    Organization_Name: user?.organizationname,
    Total_Hours: totalAssignedHours,
    Working_Hours: convertMinutesToHours(count * 10),
    Total_Clicks: mouseClicks,
    Total_keyPress: keyPress,
  };
  return obj;
}

async function createExcel(req, res, data, from, to) {
  try {
    if (data.length < 1) {
      res.status(404).json({ msg: "No Data Present for this time period" });
      return;
    }
    const headerRow = Object.keys(data[0]);
    const convertedData = [headerRow];
    data.forEach((item) => {
      const row = headerRow.map((key) => item[key]);
      convertedData.push(row);
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    worksheet.addRows(convertedData);
    const fileName = "Records.xlsx";
    // Save the Excel file to a buffer
    const excelBuffer = await workbook.xlsx.writeBuffer();
    const blobService = azure.createBlobService(CONNECTION_STRING);
    // Upload the Excel file to Azure Blob Storage
    blobService.createBlockBlobFromText(
      containerName,
      fileName,
      excelBuffer,
      async (error, result, response) => {
        if (!error) {
          // Generate a Shared Access Signature (SAS) token with a 10-minute expiration
          const startDate = new Date();
          const expiryDate = new Date(startDate);
          expiryDate.setMinutes(startDate.getMinutes() + 10);
          const sharedAccessPolicy = {
            AccessPolicy: {
              Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
              Start: startDate,
              Expiry: expiryDate,
            },
          };
          const sasToken = blobService.generateSharedAccessSignature(
            containerName,
            fileName,
            sharedAccessPolicy
          );
          // Construct the URL with the SAS token
          const fileUrl = blobService.getUrl(containerName, fileName, sasToken);
          res.status(200).json({ msg: "Export Successful", url: fileUrl });
          logController.createExportLog(req.params.adminId, from, to);

          // Schedule a deletion of the file after 10 minutes
          setTimeout(() => {
            // Delete the file by name from the container
            blobService.deleteBlob(
              containerName,
              fileName,
              (deleteError, deleteResponse) => {
                if (!deleteError) {
                  console.log(`Excel file "${fileName}" deleted successfully.`);
                } else {
                  console.error("Error deleting Excel file:", deleteError);
                }
              }
            );
          }, 5 * 60 * 1000); // 10 minutes in milliseconds
        } else {
          console.error("Error creating and uploading Excel file:", error);
        }
      }
    );
  } catch (error) {
    console.error("Error creating Excel file:", error);
    return null;
  }
}

function convertMinutesToHours(minutes) {
  if (isNaN(minutes)) {
    return "Invalid input";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

// View User API's
const getUserDailyData = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const todayDate = new Date().toISOString().split("T")[0];
    const userDocuments = await workStatusSchema
      .find({
        userid: id,
        createdat: {
          $gte: new Date(todayDate),
          $lt: new Date(todayDate + "T23:59:59.999Z"),
        },
      })
      .sort({ createdat: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    for (const document of userDocuments) {
      const blobName = document.screen;
      const imageUrl = await genUrl.getImageViewUrl(blobName);
      document.screen = imageUrl.image;
    }

    res.status(200).json({ todayData: userDocuments });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserWeeklyData = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;

    const today = new Date();
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);

    // Set the start of the week (Monday)
    startOfWeek.setDate(today.getDate() - (today.getDay() - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    // Set the end of the week (Sunday)
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const userDocuments = await workStatusSchema
      .find({
        userid: id,
        createdat: {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
      })
      .sort({ createdat: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    userDocuments.sort((a, b) => a.createdat - b.createdat);

    const groupedData = {};

    userDocuments.forEach((doc) => {
      const dayOfWeek = doc.createdat.getDay();
      const dayName = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][dayOfWeek];

      if (!groupedData[dayName]) {
        groupedData[dayName] = [];
      }

      groupedData[dayName].push(doc);
    });

    const groupedDataArray = Object.values(groupedData);
    const mainArray = [];
    mainArray.push(groupedDataArray);

    for (const document of userDocuments) {
      const blobName = document.screen;
      const imageUrl = await genUrl.getImageViewUrl(blobName);
      document.screen = imageUrl.image;
    }

    res.status(200).json({ weeklyData: mainArray });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserMonthlyData = async (req, res) => {
  try {
    const { id } = req.params;
    const todayDate = new Date();
    const startOfMonth = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    const endOfMonth = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    const userDocuments = await workStatusSchema
      .find({
        userid: id,
        createdat: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      })
      .sort({ createdat: 1 });
    const groupedData = [];
    let currentDate = new Date(startOfMonth);
    while (currentDate <= endOfMonth) {
      const currentDateFormatted = currentDate.toISOString().slice(0, 10);
      const dayData = userDocuments.filter((doc) => {
        const docDateFormatted = doc.createdat.toISOString().slice(0, 10);
        return docDateFormatted === currentDateFormatted;
      });
      groupedData.push(dayData);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    for (const document of userDocuments) {
      const blobName = document.screen;
      const imageUrl = await genUrl.getImageViewUrl(blobName);
      document.screen = imageUrl.image;
    }
    res.status(200).json({ monthlyData: groupedData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    let userDetails = await userSchema.findById(req.params.id);

    const updateUserStatus = await userSchema.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
          updateat: new Date(),
          togglestatus: 0,
          jwttoken: ""
        },
      },
      { new: true }
    );

    if (updateUserStatus) {
      const status = updateUserStatus.status == 1 ? 'activated' : 'deactivated';

      logController.createStatusUpdateLog('users_tbls', req.params.id, req.params.adminId, userDetails, status);

      res.status(200).json({
        message: `Portal user is ${status}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const filterUserReports = async (req, res) => {
  try {
    const { value, from, to } = req.query;

    // Fetch all users
    const userData = await userSchema.aggregate([
      { $match: { isdeleted: 0, status: 1 } },
      {
        $project: {
          _id: 1,
          empid: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
        },
      },
    ]);

    if (userData.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    if (value === "1") {
      const dailyData = await fetchDailyData(userData);
      return res.status(200).json(dailyData);
    } else if (value === "2") {
      const weeklyData = await fetchWeeklyData(userData, from, to);
      return res.status(200).json(weeklyData);
    } else if (value === "3") {
      const monthlyData = await fetchMonthlyData(userData, from, to);
      return res.status(200).json(monthlyData);
    }

    res.status(400).json({ message: "Invalid value" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Fetch daily data
async function fetchDailyData(userData) {
  const dailyData = [];

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set UTC time to 00:00:00
  const todayEnd = new Date();
  todayEnd.setUTCHours(0, 0, 0, 0); // Set UTC time to 00:00:00
  todayEnd.setDate(todayEnd.getDate() + 1);

  for (const user of userData) {
    const workStatus = await workStatusSchema
      .find({
        userid: user._id,
        createdat: {
          $gte: today.toISOString(),
          $lt: todayEnd.toISOString(),
        },
      })
      .sort({ createdat: -1 });

    const finalObj = {
      _id: user._id,
      empid: user.empid,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      lastWorkStatus: workStatus,
    };

    dailyData.push(finalObj);
  }

  return dailyData;
}

// Fetch weekly data
async function fetchWeeklyData(userData, from, to) {
  let From = moment(from).startOf('day')
  let To = moment(to).endOf('day')
  const fromParsedDate = moment(From);
  const fromFormattedDate = fromParsedDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
  const toParsedDate = moment(To);
  const toFormattedDate = toParsedDate.endOf('day').format('YYYY-MM-DDTHH:mm:ss');
  const weeklyData = [];
  for (const user of userData) {
    const workStatus = await workStatusSchema
      .find({
        userid: user._id,
        createdat: {
          $gte: fromFormattedDate,
          $lt: toFormattedDate,
        },
      })
      .sort({ createdat: -1 });

    const finalObj = {
      _id: user._id,
      empid: user.empid,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      lastWorkStatus: workStatus,
    };
    weeklyData.push(finalObj);
  }

  return weeklyData;
}

// Fetch monthly data
async function fetchMonthlyData(userData, from, to) {
  const monthlyData = [];

  for (const user of userData) {
    const workStatus = await workStatusSchema
      .find({
        userid: user._id,
        createdat: {
          $gte: moment(from).startOf('day'),
          $lt: moment(to).endOf('day'),
        },
        lastWorkStatus: { $ne: null },
      })
      .sort({ createdat: -1 });

    const finalObj = {
      _id: user._id,
      empid: user.empid,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      lastWorkStatus: workStatus,
    };

    monthlyData.push(finalObj);
  }

  return monthlyData;
}

// Auth User API's
const login = async (req, res) => {
  const { password } = req.body;
  try {
    const response = await adminSchema
      .findOne({ email: req.body.email })
      .exec();

    if (!response) {
      return res.status(501).json({ message: "Invalid email address" });
    }

    const isMatch = await bcrypt.compare(password, response.password);

    if (!isMatch) {
      return res.status(402).json({ message: "Invalid password" });
    }

    if (response.status !== 1) {
      return res.status(403).json({ message: "Your account is deactive or blocked" });
    }

    const { firstname, email, role } = response;
    const payload = {
      id: response._id,
      firstname,
      email,
      role,
    };
    const token = jwt.sign(payload, config.SECRET_KEY, {
      expiresIn: 86400,
    });

    res.status(200).json({
      message: `${firstname} has successfully logged in!`,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST -> CHECK OTP
const OTP_EXPIRATION_TIME_MINUTES = 1;

const checkOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const response = await otpViaEmailModel.findOne({ email });

    if (!response) {
      return res.status(510).json({ message: "Invalid email address" });
    }

    const otpResult = parseInt(otp) === response.otp;

    if (otpResult) {
      const currentDate = new Date();
      const createdDate = new Date(response.createdat);

      const timeDiffInMs = currentDate.getTime() - createdDate.getTime();
      const timeDiffInMinutes = Math.floor(timeDiffInMs / (1000 * 60));

      if (timeDiffInMinutes >= OTP_EXPIRATION_TIME_MINUTES) {
        return res
          .status(400)
          .json({ message: "OTP expired. Request a new one." });
      }

      return res.status(200).json({ message: "Valid" });
    }

    return res.status(409).json({ message: "Invalid OTP" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// POST sendOtpToUserEmail
const sendOtpToUserEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const OTP = generateRandomOtp(4);

    const mailDetails = {
      from: config.EMAIL,
      to: email,
      subject: "Your One Time Password for Work Status Tracker (Admin Portal)",
      html: `OTP: ${OTP}`,
    };

    await mailTransporter.sendMail(mailDetails);

    const existingUser = await otpViaEmailModel.findOne({ email });

    if (existingUser) {
      await otpViaEmailModel.findOneAndUpdate(
        { email },
        {
          $set: {
            otp: OTP,
            createdat: new Date(),
          },
          $inc: { requestcount: 1 },
        }
      );
    } else {
      const otpViaEmailData = new otpViaEmailModel({
        email,
        otp: OTP,
        createdat: new Date(),
        requestcount: 1,
      });
      await otpViaEmailData.save();
    }

    return res.status(200).json({
      message: "OTP sent! Check your email.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// FORGET PASSWORD POST
const forgetPassword = async (req, res) => {
  try {
    const user = await adminSchema.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ message: "Invalid email address" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      await adminSchema.findOneAndUpdate(
        { email: req.body.email },
        { $set: { password: hash, updateat: new Date() } }
      );
      res.status(200).json({ message: "Password updated" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const userDataFromTo = async (req, res) => {
  try {
    const { id, from, to } = req.body;
    const userData = await workStatusSchema
      .find({
        userid: id,
        createdat: {
          $gte: new Date(from),
          $lt: new Date(to),
        },
      })
      .sort({ createdat: -1 });

    for (const document of userData) {
      const blobName = document.screen;
      const imageUrl = await genUrl.getImageViewUrl(blobName);
      document.screen = imageUrl.image;
    }

    const groupedData = userData.reduce((result, item) => {
      const createdDate = item.createdat.toISOString().split("T")[0];
      if (result.has(createdDate)) {
        result.get(createdDate).push(item);
      } else {
        result.set(createdDate, [item]);
      }
      return result;
    }, new Map());

    const groupedArray = [...groupedData]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, items]) => items);

    res.status(200).json({ data: groupedArray });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteUserScreenshot = async (req, res) => {
  let selectedScreenshots = req.body;

  function getBlobNameFromUrl(url) {
    const parts = url.split("/");
    if (parts.length >= 7) {
      const imgNamePart = parts[6];
      const imgName = imgNamePart.split("?")[0];
      const id = parts[4];
      const date = parts[5];
      return `${id}/${date}/${imgName}`;
    }
    return null;
  }

  try {
    let deletedScreenshots = [];
    let userid = "";

    for (const item of selectedScreenshots) {
      const blobName = getBlobNameFromUrl(item.screen);

      const deleteUserScreenshot = await workStatusSchema.findByIdAndDelete({
        _id: item._id,
      });

      if (deleteUserScreenshot) {
        const containerClient =
          blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobName);

        if (await blobClient.delete()) {
          userid = item.userid;
          deletedScreenshots.push(item._id);
        }
      }
    }

    if (deletedScreenshots.length > 0) {
      const adminDetails = await adminSchema.findById(req.params.adminId);
      logController.createDeleteLogOfScreenshot("work_status_tbls", deletedScreenshots, req.params.adminId, adminDetails, userid, req.query.todayDate);
      res.status(200).json({ message: "Screenshots Deleted", deletedScreenshotIds: deletedScreenshots });
    } else {
      res.status(400).json({ message: "Error Deleting Screenshots" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// User Permissions
const addUserPermission = async (req, res) => {
  try {
    const isExist = await adminSchema.countDocuments({
      email: req.body.email,
      isdeleted: 0,
    });
    if (isExist >= 1) {
      res.status(409).json({ message: "User already exists" });
    } else {
      const newUser = new adminSchema({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: "",
        phone: req.body.phone,
        role: req.body.role,
        status: 0,
        isdeleted: 0,
        createdby: req.params.id,
        createdat: new Date(),
      });
      const savedUser = await newUser.save();

      if (savedUser) {
        const adminDetails = await adminSchema.findById(req.params.id);

        const userDetails = {
          firstname: savedUser.firstname,
          lastname: savedUser.lastname,
          adminFirstName: adminDetails.firstname,
          adminLastName: adminDetails.lastname
        };

        const usertype = req.body.role == 1 ? 'admin' : 'manager';

        logController.createAddLog('admin_users_tbls', savedUser._id, req.params.id, userDetails, usertype);

        res.status(200).json({
          message: "User added Successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getUsersPermission = async (req, res) => {
  try {
    const { page, limit, search, orderBy, orderDir } = req.query;
    const size = parseInt(limit);
    const skip = (page - 1) * size;
    const filter = {
      isdeleted: 0,
    };

    if (search) {
      filter.$or =
        [
          { firstname: { $regex: search, $options: "i" } },
          { lastname: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ];
    }

    const sort = {};
    if (orderBy) {
      sort[orderBy] = orderDir === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    let users = await adminSchema
      .find(filter)
      .sort(sort)
      .limit(size)
      .skip(skip);
    let totalDataCount = await adminSchema.countDocuments(filter);

    res.status(200).json({
      data: users,
      totalDataCount: totalDataCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUserPermission = async (req, res) => {
  try {
    const existingAdmin = await adminSchema.findById(req.params.id);
    const prevName = `${existingAdmin.firstname} ${existingAdmin.lastname}`;

    const updatedFields = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      updateat: new Date(),
      updatedby: req.params.adminId,
    };

    const changes = {};
    for (const [key, value] of Object.entries(updatedFields)) {
      if (JSON.stringify(value) !== JSON.stringify(existingAdmin[key])) {
        changes[key] = { oldValue: existingAdmin[key], newValue: value };
      }
    }

    const updateAdmin = await adminSchema.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updatedFields },
      { new: true }
    );

    const filteredChanges = Object.keys(changes).reduce((acc, key) => {
      if (changes[key].oldValue !== undefined) {
        acc[key] = changes[key];
      }
      return acc;
    }, {});

    logController.createUpdateLog('admin_users_tbls', req.params.id, req.params.adminId, filteredChanges, prevName);

    if (updateAdmin) {
      res.status(200).json({
        message: 'User updated Successfully',
        admin: updateAdmin
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteUserPermission = async (req, res) => {
  try {
    const ids = req.query.Ids.split(",").map((id) => id.trim());

    const getUserDetails = async (ids) => {
      try {
        const users = await adminSchema.find({ _id: { $in: ids } }, 'firstname lastname');

        return users;
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    const userDetails = await getUserDetails(ids);

    const deleteUsers = await adminSchema.updateMany(
      { _id: { $in: ids } },
      { isdeleted: 1 }
    );

    if (deleteUsers && userDetails.length > 0) {
      logController.createDeleteLog('admin_users_tbls', ids, req.query.adminId, userDetails);

      if (ids.length == 1) {
        res.status(200).json({
          message: `User deleted`,
        });
      } else {
        res.status(200).json({
          message: `Users deleted`,
        });
      }
    } else {
      res.status(404).json({
        message: "No users found for deletion",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUserStatusInPermission = async (req, res) => {
  try {
    let userDetails = await adminSchema.findById(req.params.id);

    const updateUserStatus = await adminSchema.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
          updateat: new Date()
        },
      },
      { new: true }
    );

    if (updateUserStatus) {
      const status = updateUserStatus.status == 1 ? 'activated' : 'deactivated';

      logController.createStatusUpdateLog('admin_users_tbls', req.params.id, req.params.adminId, userDetails, status);

      res.status(200).json({
        message: `Portal user is ${status}`,
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const sendEmailInPermission = async (req, res) => {
  try {
    const randomPassword = generateRandomPassword(8);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(randomPassword, salt);
    await adminSchema.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          password: hash,
        },
      },
      { new: true }
    );
    let mailDetails = {
      from: config.EMAIL,
      to: req.body.email,
      subject: `Your login details for VV-WST (Admin Portal)`,
      html: `Email: ${req.body.email} <br> Password: ${randomPassword} <br> VV-WST (Admin Portal) - <a href="https://delightful-sand-0871e3c10.3.azurestaticapps.net/login">click here</a>`,
    };

    await mailTransporter.sendMail(mailDetails);

    logController.createSendEmailLog('admin_users_tbls', req.params.adminId, req.params.id);

    res.status(200).json({
      message: "Email Sent To User Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// History
const getHistory = async (req, res) => {
  try {
    const { page, limit, search, orderBy, orderDir, from, to, type } = req.query;

    const size = parseInt(limit);
    const skip = (page - 1) * size;

    const filter = {};

    if (search) {
      filter.$or = [{ message: { $regex: search, $options: "i" } }];
    }

    if (type) {
      filter.type = type;
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);

      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        filter.createdat = { $gte: fromDate, $lte: toDate };
      } else {
        return res.status(400).json({ message: "Invalid date format for from or to" });
      }
    }

    const sort = {};

    if (orderBy) {
      sort[orderBy] = orderDir === "asc" ? 1 : -1;
    } else {
      sort.createdat = -1;
    }

    const history = await logSchema
      .find(filter)
      .sort(sort)
      .limit(size)
      .skip(skip);

    const totalDataCount = await logSchema.countDocuments(filter);

    res.status(200).json({
      data: history,
      totalDataCount: totalDataCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  getUserDailyData,
  getUserWeeklyData,
  getUserMonthlyData,
  updateUserStatus,
  filterUserReports,
  sendDetailsToUserViaEmail,
  login,
  exportFromTo,
  userDataFromTo,
  checkOtp,
  sendOtpToUserEmail,
  forgetPassword,
  deleteUserScreenshot,
  addUserPermission,
  getUsersPermission,
  updateUserPermission,
  deleteUserPermission,
  updateUserStatusInPermission,
  sendEmailInPermission,
  getHistory,
  logoutUser
};
