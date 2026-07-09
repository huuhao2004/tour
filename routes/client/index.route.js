const router = require("express").Router();
const tourRoutes = require("./tour.route");
const homeRouters = require("./home.route");
const cartRouters = require("./cart.route");
const contactRouters = require("./contact.route");
const categoryRoutes = require("./category.route");
const searchRoutes = require("./search.route");

const settingMiddleware = require("../../middlewares/client/setting.middleware");
const categoryMidlleware = require("../../middlewares/client/category.middleware");

router.use(settingMiddleware.websiteInfo);
router.use(categoryMidlleware.list);

router.use("/", homeRouters);
router.use("/tours", tourRoutes);
router.use("/cart", cartRouters);
router.use("/contact", contactRouters);
router.use("/category", categoryRoutes);
router.use("/search", searchRoutes);

module.exports = router;