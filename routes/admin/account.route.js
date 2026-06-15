const router = require("express").Router();
const accountcontroller = require("../../controller/admin/account.controller");

router.get("/login", accountcontroller.login);

router.get("/register", accountcontroller.register)

router.post("/register", accountcontroller.registerPost)

router.get("/register-initial", accountcontroller.registerInitial)

router.get("/forgot-password", accountcontroller.forgotPassword);

router.get("/otp-password", accountcontroller.otpPassword);

router.get("/reset-password", accountcontroller.resetPassword);


module.exports = router;