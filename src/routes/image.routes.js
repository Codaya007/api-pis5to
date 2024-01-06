var express = require("express");
var router = express.Router();
var imageController = require("../controllers/imageController");

router.post("/loadImage", imageController.upload, imageController.uploadFile);

module.exports = router;
