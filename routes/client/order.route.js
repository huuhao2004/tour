const router = require("express").Router();
const orderController = require("../../controller/client/order.controller");

router.post("/create", orderController.createPost);

module.exports = router;