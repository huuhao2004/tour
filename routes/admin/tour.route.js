const router = require("express").Router();
const tourController = require("../../controller/admin/tour.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const tourValidate = require("../../validates/admin/tour.validate");

const multer = require("multer");
const upload = multer({ storage: cloudinaryHelper.storage });

router.get("/list", tourController.list);


router.get("/create", tourController.create);

router.post("/create", upload.single("avatar"), tourValidate.createPost, tourController.createPost);

router.patch("/change-multi", tourController.changeMulti);

router.get("/trash", tourController.trash);

module.exports = router;
