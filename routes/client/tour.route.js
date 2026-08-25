const express = require("express");
const router = express.Router();
const tourController = require("../../controller/client/tour.controller");

router.get("/detail/:slug", tourController.detail);

module.exports = router;