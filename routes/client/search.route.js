const router = require("express").Router();
const searchController = require("../../controller/client/search.controller");

router.get("/", searchController.list);

module.exports = router;