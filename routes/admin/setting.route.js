const router = require("express").Router();
const settingController = require("../../controller/admin/setting.controller");
const settingValidate = require("../../validates/admin/setting.validate");

const cloudinaryHelper = require("../../helpers/cloudinary.helper");

const multer = require("multer");
const upload = multer({ storage: cloudinaryHelper.storage });

router.get("/list", settingController.list);

router.get("/website-info", settingController.websiteInfo);

router.patch("/website-info", upload.fields([
  {
    name: "logo",
    maxCount: 1
  },
  {
    name : "favicon",
    maxCount: 1
  }
]), settingValidate.websiteInfoPatch ,settingController.websiteInfoPatch);

router.get("/account-admin/list", settingController.accountAdminList);

router.get("/account-admin/create", settingController.accountAdminCreate);

router.get("/account-admin/edit/:id", settingController.accountAdminEdit);

router.patch("/account-admin/edit/:id", upload.single("avatar"), settingController.accountAdminEditPatch);

router.post("/account-admin/create", upload.single("avatar"),  settingController.accountAdminCreatePost);

router.get("/role/list", settingController.roleList);

router.get("/role/create", settingController.roleCreate);

router.post("/role/create", settingValidate.roleCreatePost, settingController.roleCreatePost);

router.get("/role/edit/:id", settingController.roleEdit);

router.patch("/role/edit/:id", settingValidate.roleEditPatch ,settingController.roleEditPatch);

module.exports = router;