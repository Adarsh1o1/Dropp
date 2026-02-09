const { Router } = require("express");
const { checkForAuthentication } = require("../middlewares/authentication");
const multer = require("multer");
const path = require("path");
const {
  handleCreateCollection,
  handleMyCollection,
  handleDeleteCollection,
  handleGetCollectionById,
  handleExploreCollections,
  handleEditCollection,
  handleSearchCollection,
} = require("../controllers/collection");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/collections/images"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

const router = Router();

router.post("/", checkForAuthentication, handleCreateCollection);

router.patch("/:id", checkForAuthentication, handleEditCollection);

router.get("/", checkForAuthentication, handleMyCollection);

router.get(
  "/getCollectionById/:id",
  checkForAuthentication,
  handleGetCollectionById,
);

router.get(
  "/exploreCollections",
  checkForAuthentication,
  handleExploreCollections,
);
router.get(
  "/search/:q",
  checkForAuthentication,
  handleSearchCollection,
);

router.delete("/:id", checkForAuthentication, handleDeleteCollection);

module.exports = router;
