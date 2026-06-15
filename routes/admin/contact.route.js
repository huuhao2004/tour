const router = require("express").Router();
const contactController = require("../../controller/admin/contact.controller");

router.get("/list", contactController.list);

module.exports = router;