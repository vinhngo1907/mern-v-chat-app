const uploadController = require("../controllers/upload.controller");
const verifyToken = require("../middleware/auth.middleware");
const router = require("express").Router();

router.post("/destroy", verifyToken, uploadController.delete)
module.exports = router;