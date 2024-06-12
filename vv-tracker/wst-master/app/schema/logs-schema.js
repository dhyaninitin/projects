const mongoose = require("mongoose");

const logsSchema = new mongoose.Schema({
  message: String,
  type: Number,
  targetid: String,
  actiontype: Number,
  // time stamps
  createdby: String,
  createdat: Date,
});

const log = mongoose.model("logs-tbl", logsSchema);
module.exports = log;