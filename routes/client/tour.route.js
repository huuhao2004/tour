const express = require("express");
const router = express.Router();
const tourController = require("../../controller/client/tour.controller");

router.get("/", tourController.list);
router.get("/detail", tourController.detail);

module.exports = router;