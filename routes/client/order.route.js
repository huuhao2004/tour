const router = require("express").Router();
const orderController = require("../../controller/client/order.controller");

router.post("/create", orderController.createPost);

router.get("/success", orderController.success);

router.get("/payment-zalopay", orderController.paymentZalopay);

router.post("/payment-zalopay-result", orderController.paymentZalopayResult);

router.get("/payment-vnpay", orderController.paymentVnpay);

router.get("/payment-vnpay-result", orderController.paymentVnpayResult);

module.exports = router;