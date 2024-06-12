const mongoose = require("mongoose");

var newAdmin = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  phone: String,
  role: Number,
  status: Number,
  isdeleted: Number,
  createdat: Date,
  createdby: String,
  updateat: Date,
  updatedby: String,
});

var adminUsersSchema = mongoose.model("admin_users_tbl", newAdmin);
module.exports = adminUsersSchema;
