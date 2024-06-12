const errorLogSchema = require("../schema/error_log.schema");

// POST METHOD
const logError = async (
  userId,
  errorMessage,
  apiName,
  actionType,
  markAsRead
) => {
  try {
    const newErrorLog = new errorLogSchema({
      userid: userId,
      message: errorMessage,
      apiname: apiName,
      actiontype: actionType,
      markAsRead: markAsRead,
      createdat: new Date(),
      isTracker: 0,
    });

    await newErrorLog.save();
  } catch (error) {
    console.error("Error saving error log:", error);
  }
};

module.exports = {
  logError,
};
