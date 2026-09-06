const router = require("express").Router();
const oderController = require("../../controller/admin/order.controller");

router.get("/list", oderController.list);

router.get("/edit/:id", oderController.edit);

router.patch("/edit/:id", oderController.editPatch)


module.exports = router;
