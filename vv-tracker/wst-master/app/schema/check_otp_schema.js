const mongoose = require("mongoose");

var otpViaEmail = mongoose.Schema({
  email: String,
  otp: Number,
  requestcount: Number,
  createdat: Date
});

var checkOtpSchema = mongoose.model("check_otp_tbl", otpViaEmail);
module.exports = checkOtpSchema;
