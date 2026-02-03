const { validateToken } = require("../services/auth");
const User = require("../models/user");

async function checkForAuthentication(req, res, next) {
  try {
    var token = req.header("Authorization");
    if (!token) return res.status(400).json({ error: "UnAuthorization" });
    token = token.split("Bearer ")[1];
    const payload = validateToken(token);
    if (JSON.stringify(payload).includes("Error")) return res.status(400).json({ error: payload.error });
    console.log(payload)
    const user = await User.findById(payload._id);
    if (payload.tv !== user.tv)
      return res
        .status(400)
        .json({ error: "Invalid token", msg: "Password changed" });
    req.user = user;
    // console.log(user);
    return next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  checkForAuthentication,
};
