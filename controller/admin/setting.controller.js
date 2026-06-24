const permissionListConfig = require("../../config/permissions");
const SettingWebsiteInfo = require("../../models/setting-website-info.model");
const Role = require("../../models/role.model");

module.exports.list = (req, res) => {
  res.render("admin/pages/setting-list.pug", {
    pageTitle: "Cài đặt chung",
  });
};

module.exports.websiteInfo = async (req, res) => {
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  res.render("admin/pages/setting-website-info.pug", {
    pageTitle: "Thông tin website",
    settingWebsiteInfo: settingWebsiteInfo
  });
};

module.exports.websiteInfoPatch = async (req, res) => {
  if (Object.keys(req.files).length > 0) {
    if (req.files.logo) {
      req.body.logo = req.files.logo[0].path;
    } else {
      delete req.body.logo;
    }
    if (req.files.favicon) {
      req.body.favicon = req.files.favicon[0].path;
    }
    else {
      delete req.body.favicon;
    }
  } else {
    delete req.body.logo;
    delete req.body.favicon;
  }

  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  if (!settingWebsiteInfo) {
    const newRecord = await SettingWebsiteInfo.create(req.body);
    newRecord.save();
  } else {
    await SettingWebsiteInfo.updateOne({
      _id: settingWebsiteInfo._id
    }, req.body)
  }

  req.flash("success", "Cập nhật thành công!")
  res.json({
    code: "success"
  })
}

module.exports.accountAdminList = (req, res) => {
  res.render("admin/pages/setting-account-admin-list.pug", {
    pageTitle: "Tài khoản quản trị",
  });
};

module.exports.accountAdminCreate = (req, res) => {
  res.render("admin/pages/setting-account-admin-create.pug", {
    pageTitle: "Tạo tài khoản quản trị",
  });
};

module.exports.roleList = async (req, res) => {
  const roleList = await Role.find({
    deleted: false
  });
  res.render("admin/pages/setting-role-list.pug", {
    pageTitle: "Nhóm quyền",
    roleList: roleList
  });
};


module.exports.roleCreate = (req, res) => {
  res.render("admin/pages/setting-role-create.pug", {
    pageTitle: " Tạo nhóm quyền",
    permissionList: permissionListConfig.permissionList
  });
};

module.exports.roleCreatePost = async (req, res) => {
  req.body.createdBy = req.account._id;
  req.body.updatedBy = req.account._id;

  const newRecord = await Role.create(req.body);
  newRecord.save();

  req.flash("success", "Tạo nhóm quyền thành công!");
  res.json({
    code: "success"
  })
};

module.exports.roleEdit = async (req, res) => {
  const id = req.params.id;

  const roleDetail = await Role.findOne({ _id: id });
  
  res.render("admin/pages/setting-role-edit.pug", {
    pageTitle: "Chỉnh sử nhóm quyền",
    permissionList: permissionListConfig.permissionList,
    roleDetail: roleDetail
  });
};

module.exports.roleEditPatch = async (req, res) => {
  try {
    const id = req.params.id;

    console.log(id);

    await Role.updateOne({ _id: id }, req.body);

    req.flash("success","Cập nhật nhóm quyền thành công!")

    res.json({
      code: "success"
    })
  } catch (error) {
    console.log(error);
  }
};
