const router = require("express").Router();
const cartController = require("../../controller/client/cart.controller");

router.get("/", cartController.cart);

module.exports = router;