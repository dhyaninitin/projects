const mongoose = require("mongoose");

var workStatus = mongoose.Schema({
  userid: String,
  projectname: String,
  task: String,
  mouseclicks: Number,
  keypresses: Number,
  screen: String,
  duration: Number,
  currentsession: String,
  todaysession: String,
  thisweeksession: String,
  timerstartedat: Date,
  assignedhours: Number,
  createdat: Date,
  updateat: Date,
});

var workStatusSchema = mongoose.model("work_status_tbl", workStatus);
module.exports = workStatusSchema;
