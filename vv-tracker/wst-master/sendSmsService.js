const twilio = require("twilio");
const userSchema = require("./app/schema/users.schema");
require("dotenv").config();
const config = process.env;
const twilioClient = twilio(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);

// Send remainder (SMS) to start tracker
async function sendReminderToStartTracker() {
  try {
    const users = await userSchema.find({ togglestatus: 0 });

    for (const user of users) {
      await sendSMS(user);
    }
  } catch (error) {
    console.error("Error sending SMS reminders:", error);
  }
}

// Send SMS
async function sendSMS(user) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date().getDay();

  try {
    if (user.assigneddays.includes(daysOfWeek[today])) {
      const toNumber = `+91${user.phone}`;

      twilioClient.messages
        .create({
          from: "+14708655101",
          to: toNumber,
          body: `Hello ${user.firstname}, Please Start your Tracker Thankyou.`,
        })
        .then((res) => console.log(res.body))
        .catch((err) => console.log(err));
    } else {
      console.log(
        `SMS not sended to ${user.firstname}, because ${daysOfWeek[today]} is not assigned.`
      );
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}

module.exports = { sendReminderToStartTracker };
