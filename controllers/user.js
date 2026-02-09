const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../services/auth");
const {
  sendVerifyMail,
  verifyEmailToken,
} = require("../services/emailverification");

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
  const { username, _id, email } = req.user;
  const result = await sendVerifyMail(username, _id, email);
  return res.json({ msg: result });
}

async function handleTokenVerification(req, res) {
  const { token } = req.params;
  try {
    const { result, payload } = verifyEmailToken(token);
    console.log(result, payload);
    if (result) {
      const id = payload.data;
      await User.findByIdAndUpdate(
        id,
        { $set: { emailVerified: true } },
        { new: true },
      );
      // console.log(user);
      return res.status(200).json({ status: "Verifed Succesfully" });
    } else {
      return res.status(400).json({ status: "invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
}

// delete all data upon user deletion is pending (future work)

async function handleDeleteUser(req, res) {
  const userId = req.user._id;
  const session = await mongoose.connection.startSession();
  try {
    session.startTransaction();
    // await Post.deleteMany({ createdBy: userId }, { session });
    // await Collection.deleteMany({ createdBy: userId }, { session });
    const deletedUser = await User.findByIdAndDelete(userId, { session });
    if (!deletedUser) return res.status(404).json({ error: "user not found" });
    await session.commitTransaction();
    return res.json({ msg: "user deleted suceessfuly" });
  } catch (error) {
    await session.abortTransaction();
    return res
      .status(500)
      .json({ status: "An error occured", error: error.name });
  } finally {
    session.endSession();
  }
}

async function handleSearch(req, res) {
  const query = req.params.q;
  try {
    const result = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    }).select("-password -email -phone -tv");

    if (!result) return res.status(404).json({ error: "not results found" });
    return res.json({ results: result });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "An error occured", error: error.name });
  }
}

async function handleGetProfile(req, res) {
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ error: "no params found" });
  try {
    const result = await User.findById(userId).select(
      "-password -email -phone -tv",
    );

    if (!result) return res.status(404).json({ error: "not results found" });

    return res.json({ results: result });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "invalid request", error: error.name });
  }
}

async function handleGetAllUsers(req, res) {
  console.log(req.user._id);
  try {
    const allUsers = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    if (!allUsers) return res.status(404).json({ error: "not results found" });
    return res.json({ results: allUsers });
  } catch (error) {
    // console.log(error);
    return res
      .status(500)
      .json({ status: "invalid request", error: error.name });
  }
}

module.exports = {
  handleLogin,
  handleSignup,
  handleProfile,
  handleEdit,
  handleUpdatePassword,
  handleEmailVerification,
  handleTokenVerification,
  handleDeleteUser,
  handleSearch,
  handleGetProfile,
  handleGetAllUsers,
};
