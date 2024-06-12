const express = require("express");
const adminRouter = express.Router();
const auth = require("../middleware/auth");

const {
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
  exportFromTo,
  userDataFromTo,
  login,
  sendOtpToUserEmail,
  checkOtp,
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
} = require("../controller/admin-controller");


const {
  getAlllogError,
  logMarkAsRead,
  deleteLogsByIds
} = require("../controller/logs-controller");

// Add User Routes
adminRouter.post("/addUser/:id", auth, addUser);

adminRouter.get("/getUsers", auth, getUser);

adminRouter.put("/updateUser/:id/:adminId", auth, updateUser);

adminRouter.delete("/deleteUser/:adminId", auth, deleteUser);

adminRouter.put("/updateUserStatus/:id/:adminId", auth, updateUserStatus);

// View User Routes
adminRouter.get("/getUserDailyData/:id", auth, getUserDailyData);

adminRouter.get("/getUserWeeklyData/:id", auth, getUserWeeklyData);

adminRouter.post("/sendDetailsToUserViaEmail/:id/:adminId", auth, sendDetailsToUserViaEmail);

adminRouter.get("/getUserMonthlyData/:id", auth, getUserMonthlyData);

adminRouter.get("/filterUserReports", auth, filterUserReports);

adminRouter.post("/exportFromTo/:adminId", auth, exportFromTo);

adminRouter.post("/userDataFromTo", auth, userDataFromTo);

adminRouter.post("/deleteUserScreenshot/:adminId", auth, deleteUserScreenshot);

// Auth Routes
adminRouter.post("/login", login);

adminRouter.post('/sendOtp', sendOtpToUserEmail);

adminRouter.post('/checkOtp', checkOtp);

adminRouter.post("/forgetPassword", forgetPassword);

// User Permission Routes
adminRouter.post("/addUserPermission/:id", auth, addUserPermission);

adminRouter.get("/getUsersPermission", auth, getUsersPermission);

adminRouter.put("/updateUserPermission/:id/:adminId", auth, updateUserPermission);

adminRouter.delete("/deleteUserPermission", auth, deleteUserPermission);

adminRouter.put("/updateUserStatusInPermission/:id/:adminId", auth, updateUserStatusInPermission);

adminRouter.post("/sendEmailInPermission/:id/:adminId", auth, sendEmailInPermission);

// History Routes
adminRouter.get("/getHistory", auth, getHistory);

// Tracker error logs routes
adminRouter.get("/getAlllogError", getAlllogError);

adminRouter.delete("/deleteLogsByIds", deleteLogsByIds);

adminRouter.put("/logMarkAsRead", logMarkAsRead);

adminRouter.put("/logoutUser", logoutUser);

module.exports = adminRouter;
