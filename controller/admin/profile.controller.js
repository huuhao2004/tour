const AccountAdmin = require("../../models/account-admin.model");
const Role = require("../../models/role.model");
const bcrypt = require("bcryptjs");


module.exports.edit = async (req, res) => {
  const profileDetail = await AccountAdmin.findOne({
    _id: req.account._id
  })

  if (profileDetail) {
    const role = Role.findOne({
      _id: profileDetail.role
    });
    profileDetail.roleName = role.name;
  }
  res.render("admin/pages/profile-edit.pug", {
    pageTitle: "Thông tin cá nhân",
    profileDetail: profileDetail
  });
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.account._id;
    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    req.body.updatedBy = req.account._id;

    await AccountAdmin.updateOne({
      _id: id
    }, req.body);

    req.flash("success", "Cập nhật thông tin tài khoản thành công!");

    res.json({
      code: "success"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: error
    });
  }
};



module.exports.changePassword = (req, res) => {
  res.render("admin/pages/profile-change-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};

module.exports.changePasswordPatch =async (req, res) => {
  try {
    const id = req.account._id;

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    console.log(password);
    
    await AccountAdmin.updateOne({
      _id: id
    }, {
      password: password,
      updatedBy: req.account._id
    });

    req.flash("success", "Cập nhật thông tin tài khoản thành công!");

    res.json({
      code: "success"
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: error
    });
  }
};