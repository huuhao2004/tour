const router = require("express").Router();
const dashboardController = require("../../controller/admin/dashboard.controller");

router.get("/", dashboardController.dashboard);

router.post("/revenue-chart", dashboardController.revenueChartPost);

module.exports = router;