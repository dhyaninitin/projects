const userSchema = require("../schema/users.schema");

const verifyMicrosoftAccount = async (req, res, next) => {
  try {
    const account = req.headers["authorization"];

    if (account === 'undefined' || !account) {
      return res.status(401).json({ message: "Microsoft account is required for authentication." });
    }
    
    const { email, exp } = JSON.parse(account).idTokenClaims;
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > exp) {
      return res.status(401).json({ message: "Session has been expired. Please try to login again." });
    }

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not authorized. Please try to login again." });
    }

    if (user.status === 0) {
      return res.status(401).json({ message: "Account deactivated or blocked. Contact administrator for assistance." });
    }

    if (user.togglestatus === 0 && user.loggedoutbyadmin === 1) {
      return res.status(401).json({ message: "You are signedOut by Admin. Please try to signIn again." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = verifyMicrosoftAccount;
