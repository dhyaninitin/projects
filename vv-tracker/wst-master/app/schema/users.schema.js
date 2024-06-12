const mongoose = require("mongoose");

var newUser = mongoose.Schema({
  empid:String,
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  phone: String,
  status: Number,
  togglestatus: Number,
  isdeleted: Number,
  isnotificationallowed: Number,
  organizationname: String,
  assignedhours: Number,
  assigneddays: Array,
  updateat: Date,
  updatedby: String,
  createdat: Date,
  createdby: String,
  jwttoken: String,
  tokengeneratedat: String,
  loggedoutbyadmin: Number
});

var usersSchema = mongoose.model("users_tbl", newUser);
module.exports = usersSchema;
