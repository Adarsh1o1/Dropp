const { validateToken } = require("../services/auth");

async function checkForAuthentication(req, res, next) {
  try {
    var token = req.header("Authorization");
    if (!token) return res.status(400).json({error: "UnAuthorization"});
    token = token.split("Bearer ")[1]
    const user = validateToken(token);
    if (!user) return res.status(400).json({error: "Invalid token"});
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
