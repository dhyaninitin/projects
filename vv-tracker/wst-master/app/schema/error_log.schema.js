const mongoose = require("mongoose");
const usersSchema = require("../schema/users.schema");

var errorLogSchema = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: usersSchema,
  },
  message: String,
  apiname: String,
  actiontype: String,
  markAsRead: Boolean,
  createdat: Date,
  isTracker: Number,
});

var ErrorLog = mongoose.model("tracker_errors_log_tbls", errorLogSchema);
module.exports = ErrorLog;
