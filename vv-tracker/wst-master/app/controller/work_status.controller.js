if (typeof globalThis === "undefined") {
  globalThis =
    typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
      ? global
      : typeof self !== "undefined"
      ? self
      : {};
}
require("dotenv").config();
const config = process.env;

const workStatusSchema = require("../schema/work_status.schema");
const logController = require("./error_logs.controller");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const sharedKeyCredential = new StorageSharedKeyCredential(
  config.AZURE_STORAGE_ACCOUNT,
  config.AZURE_STORAGE_ACCESS_KEY
);

const blobServiceClient = new BlobServiceClient(
  `https://${config.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
  sharedKeyCredential
);

function convertToIst() {
  const currentDateTime = new Date();
  currentDateTime.setHours(currentDateTime.getHours() + 5);
  currentDateTime.setMinutes(currentDateTime.getMinutes() + 30);
  return currentDateTime;
}

// POST METHOD // Save all global events & screenshot data
const saveGlobalEventsData = async (req, res) => {
  const {
    id,
    projectname,
    task,
    TotalClickCounts,
    TotalKeyCounts,
    imageUrl,
    currentsession,
    todaysession,
    thisweeksession,
    timerStartedAt,
    assignedHours,
  } = req.body;

  try {
    let todaySession;
    let weekelySession;
    let newTodaySession;
    let newWeekelySession;
    let weeklyMinutes;
    let weeklyHours;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workStatus = await workStatusSchema.aggregate([
      {
        $match: {
          userid: id,
          createdat: { $gte: today },
        },
      },
      {
        $sort: { createdat: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    const response = await getWeeklySessionById(id);

    if (!response) {
      weeklyHours = "00:00";
    } else {
      weeklyMinutes = response.length * 10;
      weeklyHours = minutesToHours(weeklyMinutes);
    }

    if (workStatus.length === 0) {
      todaySession = "00:00";
      newTodaySession = formatSessionTime(todaySession);
      weekelySession = weeklyHours;
      newWeekelySession = formatSessionTime(weekelySession);
    } else if (workStatus.length > 0) {
      todaySession = workStatus[0].todaysession;
      weekelySession = weeklyHours;
      newTodaySession = formatSessionTime(todaySession);
      newWeekelySession = formatSessionTime(weekelySession);
    }

    let userEvents = new workStatusSchema({
      userid: id,
      projectname: projectname,
      task: task,
      mouseclicks: TotalClickCounts,
      keypresses: TotalKeyCounts,
      screen: imageUrl,
      currentsession: currentsession,
      todaysession: newTodaySession,
      thisweeksession: newWeekelySession,
      timerstartedat: timerStartedAt,
      assignedhours: assignedHours,
      createdat: convertToIst(),
    });

    await userEvents.save();
    res.status(200).json({ message: "Saved", userEvents: userEvents });
  } catch (error) {
    logController.logError(
      id,
      "Error saving user data: " + error.message,
      "saveGlobalEventsData",
      "POST",
      false
    );
  }
};

// Convert minutes to hours
function minutesToHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = remainingMinutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

// Format session time
function formatSessionTime(event) {
  if (event) {
    const inputTime = event;

    const [hoursStr, minutesStr] = inputTime.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    const newMinutes = (minutes + 10) % 60;
    const newHours = hours + Math.floor((minutes + 10) / 60);

    const newTime = `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;

    return newTime;
  }
}

// GET METHOD
const getUserWorkStatus = async (req, res) => {
  try {
    const today = new Date();
    const indianTime = new Date(today.getTime() + (5 * 60 + 30) * 60 * 1000);
    indianTime.setUTCHours(0, 0, 0, 0);

    const workStatus = await workStatusSchema.aggregate([
      {
        $match: {
          userid: req.query.id,
          createdat: { $gte: indianTime },
        },
      },
      {
        $sort: { createdat: -1 },
      },
    ]);
    res.status(200).json({ workStatus });
  } catch (error) {
    logController.logError(
      req.query.id,
      "Error retrieving user work status:" + error.message,
      "getUserWorkStatus",
      "GET",
      false
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET METHOD
async function getWeeklySessionById(id) {
  try {
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
    startOfWeek.setHours(startOfWeek.getHours() + 5);
    startOfWeek.setMinutes(startOfWeek.getMinutes() + 30);
    startOfWeek.setHours(0, 0, 0, 0);
    const weekData = await workStatusSchema.find({
      userid: id,
      createdat: { $gte: startOfWeek, $lte: today },
    });

    return weekData;
  } catch (error) {
    logController.logError(
      req.query.id,
      "Error retrieving user weekly session:" + error.message,
      "getWeeklySessionById",
      "GET",
      false
    );
  }
};

// GET METHOD
const getWeeklySession = async (req, res) => {
  try {
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
    startOfWeek.setHours(startOfWeek.getHours() + 5);
    startOfWeek.setMinutes(startOfWeek.getMinutes() + 30);
    startOfWeek.setHours(0, 0, 0, 0);
    const weekData = await workStatusSchema.find({
      userid: req.query.id,
      createdat: { $gte: startOfWeek, $lte: today },
    });

    weeklyMinutes = weekData.length * 10;
    weeklyHours = minutesToHours(weeklyMinutes);

    res.status(200).json({ weeklyHours });
  } catch (error) {
    logController.logError(
      req.query.id,
      "Error retrieving user weekly session from jquery:" + error.message,
      "getWeeklySession",
      "GET",
      false
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE METHOD
const deleteUserScreenshot = async (req, res) => {
  try {
    const latestScreenshot = await workStatusSchema
      .findOneAndDelete({ userid: req.query.id })
      .sort({ createdat: -1 });

    if (!latestScreenshot) {
      res.status(404).json({ message: "No screenshots found for deletion" });
    }

    const blobName = latestScreenshot.screen;
    const containerClient = blobServiceClient.getContainerClient("vv-tracker");
    const blobClient = containerClient.getBlobClient(blobName);

    if (await blobClient.delete()) {
      res.status(200).json({ message: "Deleted" });
    } else {
      res.status(400).json({ message: "Error deleting the latest screenshot" });
    }
  } catch (error) {
    logController.logError(
      req.query.id,
      "Error deleting user screenshot:" + error.message,
      "deleteUserScreenshot",
      "DELETE",
      false
    );
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET METHOD
const getLastScreenshot = async (req, res) => {
  try {
    const lastWorkStatus = await workStatusSchema
      .findOne({ userid: req.query.id })
      .sort({ createdat: -1 })
      .exec();

    res.status(200).json({ workStatusData: lastWorkStatus });
  } catch (error) {
    logController.logError(
      req.query.id,
      "Error retrieving last screenshot:" + error.message,
      "getLastScreenshot",
      "GET",
      false
    );
    console.error("Error retrieving last screenshot:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  saveGlobalEventsData,
  getUserWorkStatus,
  getWeeklySession,
  deleteUserScreenshot,
  getLastScreenshot,
};
