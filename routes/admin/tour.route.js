const router = require("express").Router();
const tourController = require("../../controller/admin/tour.controller");

router.get("/list", tourController.list);
router.get("/create", tourController.create);
router.get("/trash", tourController.trash);

module.exports = router;
