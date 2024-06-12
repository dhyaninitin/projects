const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = process.env;
const userSchema = require("../schema/users.schema");

const verifyTrackerToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "A token is required for authentication." });
  }

  try {
    const tokenArr = token.split(" ");
    token = tokenArr[1];
    const decoded = jwt.verify(token, config.SECRET_KEY_TRACKER);
    let userId = decoded.id;

    try {
      let response = await userSchema.findById(userId);

      if (response.status === 0) {
        return res.status(403).json({
          message:
            "Account deactivated or blocked. Contact administrator for assistance.",
        });
      }

      if (
        response.jwttoken === "" &&
        response.togglestatus === 0 &&
        response.loggedoutbyadmin === 1
      ) {
        return res.status(455).json({
          message: "You are logged out by Admin. Please try to login again.",
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
      return res.status(401).json({
        message: "Session has been expired. Please try to login again.",
      });
    }
  }
};

module.exports = verifyTrackerToken;
