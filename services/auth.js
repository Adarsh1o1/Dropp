const jwt = require("jsonwebtoken");

const secret = "Adar$h i5 a node nOde Devel0per#23484 feer4";

function generateToken(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    fullname: user.fullName,
    tv: user.tv,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  return token;
}

function validateToken(token) {
  try {
    const payload = jwt.verify(token, secret);

    return payload;
  } catch (error) {
    return {error: error.name};
  }
}

module.exports = {
  generateToken,
  validateToken,
};
