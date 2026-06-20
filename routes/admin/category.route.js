const router = require("express").Router();
const categoryController = require("../../controller/admin/category.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const categoryValidate = require("../../validates/admin/category.validate");

const multer = require("multer");
const upload = multer({ storage: cloudinaryHelper.storage });

router.get("/list", categoryController.list);

router.get("/create", categoryController.create);

router.post("/create", upload.single('avatar'), categoryValidate.createPost, categoryController.createPost);

router.get("/edit/:id", categoryController.edit);

router.patch("/edit/:id", upload.single('avatar'), categoryValidate.editPatch, categoryController.editPatch);

module.exports = router;
