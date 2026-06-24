const AccountAdmin = require("../../models/account-admin.model");
const Role = require("../../models/role.model");


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