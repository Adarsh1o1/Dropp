const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      default: "Earth",
    },
    link: {
      type: String,
      default: "",
    },
    pronoun: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    dob: {
        type: Date,
        require: true,
    },
    bio: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        unique: true,
        require:true
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    password: {
      type: String,
      require: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/default.webp",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    tv: {
      type: Number,
      default: 0
    }
  },
  {timestamps: true}
);



userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const saltRounds = 10

  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  this.password = hashedPassword;
  next;
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

