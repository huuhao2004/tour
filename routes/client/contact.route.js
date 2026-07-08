const router = require("express").Router();
const contactController = require("../../controller/client/contact.controller");

router.post("/create", contactController.createPost);

module.exports = router;