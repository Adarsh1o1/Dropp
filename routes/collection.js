const { Router } = require("express");
const { checkForAuthentication } = require("../middlewares/authentication");
const {
  handleCreateCollection,
  handleGetCollectionByUserId,
  handleDeleteCollection,
  handleGetCollectionById,
  handleExploreCollections,
  handleEditCollection,
  handleSearchCollection,
  handleLike,
} = require("../controllers/collection");

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve("./public/collections/images"));
//   },
//   filename: function (req, file, cb) {
//     const filename = `${Date.now()}-${file.originalname}`;
//     cb(null, filename);
//   },
// });
// const upload = multer({ storage });

const router = Router();

router.post("/", checkForAuthentication, handleCreateCollection);

router.patch("/:id", checkForAuthentication, handleEditCollection);

router.get(
  "/getCollectionByUserId/:id",
  checkForAuthentication,
  handleGetCollectionByUserId,
);

router.get(
  "/getCollectionById/:id",
  checkForAuthentication,
  handleGetCollectionById,
);

router.get(
  "/explore/collections",
  checkForAuthentication,
  handleExploreCollections,
);

router.get("/search/:q", checkForAuthentication, handleSearchCollection);

router.get("/like/:id", checkForAuthentication, handleLike);

router.delete("/:id", checkForAuthentication, handleDeleteCollection);

module.exports = router;
