const userSchema = require("../schema/users.schema");
const logController = require("./error_logs.controller");

// GET METHOD
const getUser = async (req, res) => {
  try {
    let data = await userSchema.findById({ _id: req.query.id });
    if (data) {
      res.status(200).json({ userData: data });
    }
  } catch (error) {
    logController.logError(
      req.query.id,
      "Error getting User: " + error.message,
      "getUser",
      "GET",
      false
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT METHOD
const updateNotificationStatus = async (req, res) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(
      { _id: req.body.id },
      { isnotificationallowed: req.body.isnotificationallowed },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ isnotificationallowed: updatedUser.isnotificationallowed });
  } catch (error) {
    logController.logError(
      req.body.id,
      "Error updating notification status: " + error.message,
      "updateNotificationStatus",
      "PUT",
      false
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT METHOD
const updateUserToggleStatus = async (req, res) => {
  try {
    let data = await userSchema.findByIdAndUpdate(
      req.body.id,
      { togglestatus: req.body.status },
      { new: true }
    );

    if (data) {
      return res.status(200).json({ message: `Toggle status updated to ${data.togglestatus}` });
    }
  } catch (error) {
    logController.logError(
      req.body.id,
      "Error updating toggle status: " + error.message,
      "updateUserToggleStatus",
      "PUT",
      false
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUser,
  updateNotificationStatus,
  updateUserToggleStatus,
};
