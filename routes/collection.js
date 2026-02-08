const { Router } = require("express");
const { checkForAuthentication } = require("../middlewares/authentication");
const multer = require("multer");
const path = require("path");
const { handleCreateCollection,handleMyCollection, handleDeleteCollection } = require("../controllers/collection");

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

router.post('/', checkForAuthentication, upload.single('image'), handleCreateCollection);

router.get('/', checkForAuthentication, handleMyCollection);

router.delete('/:id', checkForAuthentication, handleDeleteCollection);

module.exports = router;