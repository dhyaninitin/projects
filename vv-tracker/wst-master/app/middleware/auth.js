const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = process.env;
const adminSchema = require("../schema/admin_users.schema");

const verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "A token is required for authentication." });
  }

  try {
    const tokenArr = token.split(" ");
    token = tokenArr[1];
    const decoded = jwt.verify(token, config.SECRET_KEY);

    const adminId = decoded.id;
    const adminRole = decoded.role;

    try {
      let response = await adminSchema.findById({ _id: adminId });

      if (!response || response.status === 0) {
        return res
          .status(403)
          .json({ message: "Your account is deactivated or blocked" });
      } else if (response.role !== adminRole) {
        return res
          .status(401)
          .json({
            message: "Your role has been changed by admin, log in again",
          });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }

    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    } else {
      console.error(err);
      return res.status(403).send("Invalid token.");
    }
  }
};

module.exports = verifyToken;
