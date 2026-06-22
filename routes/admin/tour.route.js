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

router.get("/edit/:id", tourController.edit);

router.patch("/edit/:id", upload.single('avatar'), tourValidate.editPatch, tourController.editPatch);

router.patch("/delete/:id", tourController.delete);

router.get("/trash", tourController.trash);

router.patch("/undo/:id", tourController.undoPatch);

router.patch("/delete-destroy/:id", tourController.deleteDestroyPatch);

module.exports = router;
