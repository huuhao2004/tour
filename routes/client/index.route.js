const router = require("express").Router();
const tourRoutes = require("./tour.route");
const homeRouters = require("./home.route");
const cartRouters = require("./cart.route");

router.use("/", homeRouters);
router.use("/tours", tourRoutes);
router.use("/cart", cartRouters);

module.exports = router;