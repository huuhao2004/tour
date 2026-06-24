const permissionListConfig = require("../../config/permissions");
const SettingWebsiteInfo = require("../../models/setting-website-info.model");
const Role = require("../../models/role.model");
const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require('bcryptjs');

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

module.exports.accountAdminList = async (req, res) => {
  const accountAdminList = await AccountAdmin.find({
    deleted: false
  }).sort({ cretedAt: "desc" });
  
  for (const item of accountAdminList) {
    if (item.role) {
      const roleItem = await Role.findOne({ _id: item.role });

      if (roleItem) {
        item.roleName = roleItem.name;
      }
    }
  }

  res.render("admin/pages/setting-account-admin-list.pug", {
    pageTitle: "Tài khoản quản trị",
    accountAdminList: accountAdminList
  });
};

module.exports.accountAdminCreate = async (req, res) => {
  const roleList = await Role.find({ deleted: false });
  res.render("admin/pages/setting-account-admin-create.pug", {
    pageTitle: "Tạo tài khoản quản trị",
    roleList: roleList
  });
};

module.exports.accountAdminEdit = async (req, res) => {
  const id = req.params.id;

  const accountAdmin = await AccountAdmin.findOne({
    deleted: false,
    _id: id
  });

  const roleList = await Role.find({ deleted: false });

  res.render("admin/pages/setting-account-admin-edit.pug", {
    pageTitle: "Chỉnh sửa tài khoản quản trị",
    accountAdmin: accountAdmin,
    roleList: roleList
  });
};

module.exports.accountAdminEditPatch = async (req, res) => {
  try {

    const id = req.params.id;

    const accountAdmin = await AccountAdmin.findOne({ _id: id });

    req.body.updatedBy = req.account._id;
    
    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    
    if (accountAdmin.email !== req.body.email) {
      const exitsAccount = await AccountAdmin.findOne({
        email: req.body.email,
        deleted: false
      });

      if (exitsAccount) {
        return res.json({
          code: "error",
          message: "Email đã tồn tại trong hệ thống!"
        });
      }
    }

    //hash passsword
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } else {
      delete req.body.password
    }

    await AccountAdmin.updateOne({
      _id: id
    }, req.body)


    req.flash("success", "Cập nhật tài khoản quản trị thành công!");

    res.json({
      code: "success"
    })

  } catch (error) {
    console.log(error)
  }
};

module.exports.accountAdminCreatePost = async (req, res) => {
  try {
    req.body.createdBy = req.account._id;
    req.body.updatedBy = req.account._id;
    req.body.avatar = req.file ? req.file.path : "";

    const exitsAccount = await AccountAdmin.findOne({
      email: req.body.email
    });
    if (exitsAccount) {
      res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!"
      });
      return;
    }

    //hash passsword
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    
    const newAccount = await AccountAdmin.create(req.body);
    newAccount.save();


    req.flash("success", "Tạo tài khoản quản trị thành công!");

    res.json({
      code: "success"
    })

  } catch (error) {
    console.log(error)
  }
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
