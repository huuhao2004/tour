const router = require("express").Router();
const cartController = require("../../controller/client/cart.controller");

router.get("/", cartController.cart);

router.post("/detail", cartController.detailPost);

module.exports = router;