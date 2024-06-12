// MODULES IMPORT
const bodyparser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const sendSmsSer = require("./sendSmsService");
const delSsSer = require("./deleteScreenshotsService");
const cors = require("cors");
const app = express();
require("dotenv").config();
const config = process.env;

app.use(cors());

mongoose.set("strictQuery", true);
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json({ limit: "100mb" }));

// ADMIN ROUTES
const adminRouter = require("./app/routes/admin-route");
app.use("/api/admin", adminRouter);

// Remind user at 10:30 AM daily to start Tracker if not started yet
// schedule.scheduleJob("30 10 * * *", sendSmsSer.sendReminderToStartTracker);

// Delete all user Screenshots data older than 60 days which runs on 1 date of every month at 1 AM
schedule.scheduleJob('0 0 1 * *', delSsSer.deleteAllUserScreenshots);

// TRACKER ROUTES
const trackerRouter = require("./app/routes/tracker-route");
app.use("/api/tracker", trackerRouter);

// TRACKER ROUTES for Micosoft Sign in
const msTrackerRouter = require("./app/routes/ms-tracker-route");
app.use("/api/ms-auth-tracker", msTrackerRouter);

// DB CONNECTION
mongoose.connect(config.DB_URL, { serverSelectionTimeoutMS: 20000 });
mongoose.connection.on("connected", () => {
  app.listen(config.PORT || 5000, () => {
    console.log(`app running on port ${config.PORT}`);
  });
});
