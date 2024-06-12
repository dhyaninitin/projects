const express = require("express");
const trackerRouter = express.Router();

const {
  loginWithCreds,
  loginIfTokenIsPresent,
} = require("../controller/auth.controller");

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

const auth = require("../middleware/tracker-auth");

// Auth controller routes
trackerRouter.post("/loginWithCreds", loginWithCreds);

trackerRouter.post("/login", auth, loginIfTokenIsPresent);

// User controller routes
trackerRouter.get("/getUser", auth, getUser);

trackerRouter.put("/updateNotificationStatus", auth, updateNotificationStatus);

trackerRouter.put("/updateUserToggleStatus", auth, updateUserToggleStatus);

// Work status controller routes
trackerRouter.post("/saveGlobalEventsData", auth, saveGlobalEventsData);

trackerRouter.get("/getWorkStatus", auth, getUserWorkStatus);

trackerRouter.get("/getWeeklySession", auth, getWeeklySession);

trackerRouter.delete("/deleteUserScreenshot", auth, deleteUserScreenshot);

trackerRouter.get("/getLastScreenshot", auth, getLastScreenshot);

// Generate view url of image
trackerRouter.get("/getImageViewUrl", auth, getImageViewUrl);

module.exports = trackerRouter;
