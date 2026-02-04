const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../services/auth");
const sendVerifyMail = require('../services/emailverification');


async function handleLogin(req, res) {
  const { identifier, password } = req.body;
  if (!identifier || !password)
    return res
      .status(400)
      .json({ error: "username or email and password is required" });

  const isEmail = identifier.includes("@");
  const user = await User.findOne(
    isEmail ? { email: identifier } : { username: identifier },
  );
  if (!user)
    return res.status(404).json({
      error: "User not found",
    });
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(404).json({
      error: "Invalid credentials",
    });
  }
  const token = generateToken(user);
  req.user = user;
  return res
    .status(200)
    .header({ Authorization: `Bearer ${token}` })
    .json({ signature: "ok", token: token });
}

async function handleSignup(req, res) {
  const { fullName, email, password, dob, username, phone } = req.body;
  if (!fullName || !email || !password || !dob || !username || !phone)
    return res.status(400).json({ error: "All fields are required" });
  try {
    await User.create({
      fullName,
      email,
      password,
      dob,
      username,
      phone,
    });
    res.status(201).json({ msg: "user created" });
  } catch (error) {
    console.log(error.code);
    const field = Object.keys(error.keyValue)[0];
    if (error.code === 11000) {
      res.status(400).json({ error: `${field} already exists` });
    }
  }
}

async function handleProfile(req, res) {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");
  return res.json(user);
}

async function handleEdit(req, res) {
  try {
    const userId = req.user._id;
    // console.log(req.file);
    const updates = {};
    const allowed_updates = [
      "fullName",
      "location",
      "link",
      "pronoun",
      "username",
      "dob",
      "bio",
      "profileImageUrl",
    ];
    for (const key of allowed_updates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
      if (req.file) {
        updates["profileImageUrl"] = `/images/${req.file.filename}`;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    // console.log(updates);

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true },
    ).select("-password");
    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
}

async function handleUpdatePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res
      .status(400)
      .json({ error: "Old Password and New Password is required." });
  if (oldPassword === newPassword)
    return res
      .status(400)
      .json({ error: "Old Password and New Password Could not be same." });
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    console.log(oldPassword, newPassword, user);

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(404).json({
        error: "Old Password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { password: hashedPassword }, $inc: { tv: 1 } },

      { new: true },
    );
    return res.json({
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "something went wrong" });
  }
}

async function handleEmailVerification(req, res) {
  const {username, email} = req.user;
  const result = await sendVerifyMail(username, email);
  return res.json({ msg: result });
}

module.exports = {
  handleLogin,
  handleSignup,
  handleProfile,
  handleEdit,
  handleUpdatePassword,
  handleEmailVerification,
};
