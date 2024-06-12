const adminSchema = require("../schema/admin_users.schema");
const log = require("../schema/logs-schema");
const userSchema = require("../schema/users.schema");
const moment = require("moment");
const { ACTION_TYPE_ENUMS, TABLE_TYPE_ENUMS } = require("../../enum");
const errorLogSchema = require("../schema/error_log.schema");

// User / User-permission Create LOGS
const createAddLog = async (
  tableName,
  targetId,
  createdBy,
  userDetails,
  usertype
) => {
  try {
    let createdAt = new Date();
    const logEntry = new log({
      message: `New ${usertype} ${userDetails.firstname} ${userDetails.lastname} was created by ${userDetails.adminFirstName} ${userDetails.adminLastName} (admin)`,
      type: TABLE_TYPE_ENUMS[tableName],
      targetid: targetId,
      actiontype: ACTION_TYPE_ENUMS.POST,
      createdby: createdBy,
      createdat: createdAt,
    });

    await logEntry.save();
  } catch (error) {
    console.error(error);
  }
};

// User / User-permission Update LOGS
const createUpdateLog = async (
  tableName,
  targetId,
  updatedby,
  changes,
  prevName
) => {
  try {
    const adminData = await getAdminDetailById(updatedby);

    let createdAt = new Date();
    const logEntry = new log({
      message: generateUpdateMessage(changes, adminData, prevName, createdAt),
      type: TABLE_TYPE_ENUMS[tableName],
      targetid: targetId,
      actiontype: ACTION_TYPE_ENUMS.PUT,
      createdby: updatedby,
      createdat: createdAt,
    });

    await logEntry.save();
  } catch (error) {
    console.error(error);
  }
};

const generateUpdateMessage = (changes, adminData, prevName, createdAt) => {
  let message = "";
  const entries = Object.entries(changes);

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];

    if (key !== "updateat" && key !== "updatedby") {
      message += `${key} changed from ${value.oldValue} to ${value.newValue}`;

      if (i < entries.length - 2) {
        message += ", ";
      } else if (i === entries.length - 2) {
        message += " & ";
      }
    }
  }

  message += ` of ${prevName} by ${adminData?.firstname} ${adminData?.lastname} (admin)`;

  return message;
};

// User / User-permission Delete LOGS
const createDeleteLog = async (
  tableName,
  targetIds,
  deletedBy,
  userDetails
) => {
  try {
    let message = "";
    let targetIdString = Array.isArray(targetIds)
      ? targetIds.join(", ")
      : targetIds.toString();
    let createdAt = new Date();

    const admin = await getAdminDetailById(deletedBy);

    if (Array.isArray(targetIds) && targetIds.length > 0) {
      if (targetIds.length > 1) {
        message = `${targetIds.length} Users `;
        targetIds.forEach((userId, index) => {
          const user = userDetails.find(
            (user) => user._id.toString() == userId
          );

          if (user) {
            message += `${user.firstname} ${user.lastname}`;

            if (index < targetIds.length - 2) {
              message += ", ";
            } else if (index === targetIds.length - 2) {
              message += ` & `;
            }
          }
        });
        message += ` has been deleted by ${
          admin.firstname + " " + admin.lastname
        } (Admin)`;
      } else {
        const user = userDetails.find(
          (user) => user._id.toString() == targetIds[0]
        );

        if (user) {
          message = `User ${user.firstname} ${
            user.lastname
          } has been deleted by ${
            admin.firstname + " " + admin.lastname
          } (Admin)`;
        }
      }
    }

    const logEntry = new log({
      message,
      type: TABLE_TYPE_ENUMS[tableName],
      targetid: targetIdString,
      actiontype: ACTION_TYPE_ENUMS.DELETE,
      createdby: deletedBy,
      createdat: createdAt,
    });

    await logEntry.save();
  } catch (error) {
    console.error(error);
  }
};

// User / User-permission Status Update LOGS
const createStatusUpdateLog = async (
  tableName,
  targetId,
  updatedBy,
  userDetails,
  newStatus
) => {
  try {
    let createdAt = new Date();

    const admin = await getAdminDetailById(updatedBy);

    const logMessage = `${userDetails.firstname} ${userDetails.lastname} status has been changed to ${newStatus} by ${admin.firstname} ${admin.lastname} (admin)`;

    const logEntry = new log({
      message: logMessage,
      type: TABLE_TYPE_ENUMS[tableName],
      targetid: targetId,
      actiontype: ACTION_TYPE_ENUMS.PUT,
      createdby: updatedBy,
      createdat: createdAt,
    });

    await logEntry.save();
  } catch (error) {
    console.error(error);
  }
};

// User / User-permission Send Email LOGS
const createSendEmailLog = async (type, adminId, userId) => {
  try {
    let admin;
    let user;
    let createdAt = new Date();

    if (type == "users_tbls") {
      admin = await getAdminDetailById(adminId);
      user = await userSchema.findById(userId, "firstname lastname");
    } else if (type == "admin_users_tbls") {
      admin = await getAdminDetailById(adminId);
      user = await getAdminDetailById(userId);
    }

    if (admin && user) {
      const message = `Password change email has been sent to ${user.firstname} ${user.lastname} by ${admin.firstname} ${admin.lastname} (admin)`;

      const logEntry = new log({
        message,
        type: TABLE_TYPE_ENUMS[type],
        targetid: userId,
        actiontype: ACTION_TYPE_ENUMS.POST,
        createdby: adminId,
        createdat: createdAt,
      });

      await logEntry.save();
    }
  } catch (error) {
    console.error(error);
  }
};

const createExportLog = async (adminId, from, to) => {
  try {
    let createdAt = new Date();
    let data = await getAdminDetailById(adminId);

    if (data) {
      const logMessage = `${data.firstname} ${
        data.lastname
      } (admin) has exported users data from ${moment(from).format(
        "MMM Do YY"
      )} to ${moment(to).format("MMM Do YY")}`;
      const logEntry = new log({
        message: logMessage,
        type: TABLE_TYPE_ENUMS["users_tbls"],
        targetid: null,
        actiontype: ACTION_TYPE_ENUMS.POST,
        createdby: adminId,
        createdat: createdAt,
      });
      await logEntry.save();
    }
  } catch (error) {
    console.error(error);
  }
};

const createDeleteLogOfScreenshot = async (
  tableName,
  deletedScreenshots,
  deletedBy,
  adminDetails,
  userid,
  todayDate
) => {
  try {
    let createdAt = new Date();
    let message = "";
    let targetIds = deletedScreenshots.map((screenshotId) =>
      screenshotId.toString()
    );
    let userDetails = await userSchema.findById(userid);

    if (targetIds.length > 0) {
      if (targetIds.length > 1) {
        message = `${targetIds.length} Screenshots `;
        message += ` of ${userDetails.firstname} ${
          userDetails.lastname
        } on (${moment(todayDate).format("MMM Do YY")}) have been deleted by ${
          adminDetails.firstname
        } ${adminDetails.lastname} (Admin)`;
      } else {
        message = `Screenshot of ${userDetails.firstname} ${
          userDetails.lastname
        } on (${moment(todayDate).format("MMM Do YY")}) has been deleted by ${
          adminDetails.firstname
        } ${adminDetails.lastname} (Admin)`;
      }
    }

    const logEntry = new log({
      message,
      type: TABLE_TYPE_ENUMS[tableName],
      targetid: userid,
      actiontype: ACTION_TYPE_ENUMS.DELETE,
      createdby: deletedBy,
      createdat: createdAt,
    });

    await logEntry.save();
  } catch (error) {
    console.error("Error creating delete log:", error);
  }
};

async function getAdminDetailById(id) {
  return await adminSchema.findById(id, "firstname lastname");
}

const getAlllogError = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query = { message: { $regex: search, $options: "i" } };
    }

    const totalDataCount = await errorLogSchema.countDocuments(query);

    const logs = await errorLogSchema
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: "userid",
        select: "_id empid firstname lastname email phone",
      })
      .exec();

    res.status(200).json({
      data: logs,
      page: parseInt(page),
      limit: parseInt(limit),
      totalDataCount: totalDataCount,
    });
  } catch (error) {
    console.error("Error retrieving error logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logMarkAsRead = async (req, res) => {
  try {
    const { id, userid } = req.body;
    const updatedLog = await errorLogSchema.findOneAndUpdate(
      {
        _id: id,
      },
      { $set: { markAsRead: true } },
      { new: true }
    );
    if (updatedLog) {
      res.status(200).json({
        data: updatedLog,
      });
    } else {
      res.status(404).json({ error: "Log not found" });
    }
  } catch (error) {
    console.error("Error updating log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createDelLogOfAllScreenshots = async (message) => {
  try {
    let createdAt = new Date();

    const logEntry = new log({
      message,
      type: TABLE_TYPE_ENUMS["work_status_tbls"],
      targetid: null,
      actiontype: ACTION_TYPE_ENUMS.DELETE,
      createdby: null,
      createdat: createdAt,
    });

    await logEntry.save();
  } catch (error) {}
};

const deleteLogsByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    let idArray = ids.split(',')
    if (!idArray || !Array.isArray(idArray) || idArray.length === 0) {
      return res.status(400).json({ error: "Invalid or missing 'ids' parameter" });
    }
    const deleteResult = await errorLogSchema.deleteMany({ _id: { $in: idArray } });
    res.status(200).json({
      message: `Successfully deleted ${deleteResult.deletedCount} logs`,
    });
  } catch (error) {
    console.error("Error deleting error logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createUserLogoutLog = async (tableName, targetId, adminId) => {
  try {
    const data = await getAdminDetailById(adminId);
    const userData = await userSchema.findById(targetId)

    if(data && userData) {
      let createdAt = new Date();
      const logEntry = new log({
        message: `${userData.firstname} ${userData.lastname} has been logged out by ${data.firstname} ${data.lastname} (admin)`,
        type: TABLE_TYPE_ENUMS[tableName],
        targetid: targetId,
        actiontype: ACTION_TYPE_ENUMS.PUT,
        createdby: adminId,
        createdat: createdAt,
      });
  
      await logEntry.save();
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createAddLog,
  createUpdateLog,
  createDeleteLog,
  createStatusUpdateLog,
  createSendEmailLog,
  createExportLog,
  createDeleteLogOfScreenshot,
  getAlllogError,
  logMarkAsRead,
  createDelLogOfAllScreenshots,
  deleteLogsByIds,
  createUserLogoutLog
};
