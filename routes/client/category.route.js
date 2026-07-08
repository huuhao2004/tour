const router = require("express").Router();

const categoryController = require("../../controller/client/category.controller");

router.get("/:slug", categoryController.list);

module.exports = router;