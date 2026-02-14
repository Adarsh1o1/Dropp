const { Router } = require("express");
const { checkForAuthentication } = require("../middlewares/authentication");
const { handleCreateProduct } = require("../controllers/product");

const router = Router();

router.post("/cId/:id", checkForAuthentication, handleCreateProduct);

module.exports = router;
