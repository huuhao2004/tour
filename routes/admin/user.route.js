const router = require("express").Router();
const userController = require("../../controller/admin/user.controller");

router.get("/list", userController.list);


module.exports = router;
