const { Router } = require("express");
const {
  handleLogin,
  handleSignup,
  handleProfile,
  handleEdit,
  handleUpdatePassword,
  handleEmailVerification,
  handleTokenVerification,
  handleDeleteUser,
  handleSearch,
} = require("../controllers/user");
const { checkForAuthentication } = require("../middlewares/authentication");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/images/"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

const router = Router();

router.post("/login", handleLogin);

router.post("/signup", handleSignup);

router.get("/profile", checkForAuthentication, handleProfile);

router.patch(
  "/profile",
  checkForAuthentication,
  upload.single("image"),
  handleEdit,
);

router.patch("/update-password", checkForAuthentication, handleUpdatePassword);

router.get("/verify-email", checkForAuthentication, handleEmailVerification);

router.get("/verify/:token", handleTokenVerification);

router.get('/search/:q', checkForAuthentication, handleSearch);

router.delete("/delete", checkForAuthentication, handleDeleteUser);

module.exports = router;
