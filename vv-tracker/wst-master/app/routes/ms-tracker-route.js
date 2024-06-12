const express = require("express");
const msTrackerRouter = express.Router();

const {
  getUser,
  updateNotificationStatus,
  updateUserToggleStatus,
} = require("../controller/user.controller");

const {
  saveGlobalEventsData,
  getUserWorkStatus,
  getWeeklySession,
  deleteUserScreenshot,
  getLastScreenshot,
} = require("../controller/work_status.controller");

const { getImageViewUrl } = require("../controller/generateViewUrlOfBlob");

const auth = require("../middleware/ms-tracker-auth");

// User controller routes
msTrackerRouter.get("/getUser", auth, getUser);

msTrackerRouter.put("/updateNotificationStatus", auth, updateNotificationStatus);

msTrackerRouter.put("/updateUserToggleStatus", auth, updateUserToggleStatus);

// Work status controller routes
msTrackerRouter.post("/saveGlobalEventsData", auth, saveGlobalEventsData);

msTrackerRouter.get("/getWorkStatus", auth, getUserWorkStatus);

msTrackerRouter.get("/getWeeklySession", auth, getWeeklySession);

msTrackerRouter.delete("/deleteUserScreenshot", auth, deleteUserScreenshot);

msTrackerRouter.get("/getLastScreenshot", auth, getLastScreenshot);

// Generate view url of image
msTrackerRouter.get("/getImageViewUrl", auth, getImageViewUrl);

module.exports = msTrackerRouter;
