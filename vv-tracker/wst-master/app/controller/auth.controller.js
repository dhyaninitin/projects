const usersSchema = require("../schema/users.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logController = require("./error_logs.controller");

// POST METHOD
const loginWithCreds = async (req, res) => {
  try {
    const response = await usersSchema.findOne({ email: req.body.email });

    if (!response) {
      return res.status(452).json({ message: "Invalid Email Address." });
    }

    if (response.status == 0) {
      return res.status(453).json({
        message:
          "Account deactivated or blocked. Contact administrator for assistance.",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, response.password);

    if (!isMatch) {
      return res.status(454).json({ message: "Invalid Password." });
    }

    const { firstname, lastname, email } = response;
    const payload = {
      id: response._id,
      firstname,
      lastname,
      email,
    };

    const token = jwt.sign(payload, "SuperSecretKey@WorkStatusTracker", {
      expiresIn: 60 * 60 * 24 * 4,
    });

    await usersSchema.findByIdAndUpdate(
      { _id: response._id },
      { $set: { jwttoken: token, togglestatus: 0, loggedoutbyadmin: 0 } },
      { new: true }
    );

    const successMessage = `Welcome ${firstname}`;
    const userName = firstname + " " + lastname;

    res.status(200).json({ successMessage, userName, token });
  } catch (error) {
    logController.logError(
      req.body.email,
      "Error login: " + error.message,
      "login",
      "POST",
      false
    );
  }
};

// Login if token is present
const loginIfTokenIsPresent = async (req, res) => {
  const { firstname, lastname } = req.body;

  try {
    await usersSchema.findByIdAndUpdate(
      { _id: req.body.id },
      { $set: { togglestatus: 0, loggedoutbyadmin: 0 } },
      { new: true }
    );

    const successMessage = `Welcome Back ${firstname}`;
    const userName = firstname + " " + lastname;

    res.status(200).json({ successMessage, userName });
  } catch (error) {
    logController.logError(
      req.body.id,
      "Error login: " + error.message,
      "loginIfTokenIsPresent",
      "POST",
      false
    );
  }
};

module.exports = {
  loginWithCreds,
  loginIfTokenIsPresent,
};
