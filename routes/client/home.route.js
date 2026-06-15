const router = require("express").Router();
const homeController = require("../../controller/client/home.controller");

router.get("/", homeController.home);

module.exports = router;

