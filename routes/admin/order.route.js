const router = require("express").Router();
const oderController = require("../../controller/admin/order.controller");

router.get("/list", oderController.list);

router.get("/edit", oderController.edit);


module.exports = router;
