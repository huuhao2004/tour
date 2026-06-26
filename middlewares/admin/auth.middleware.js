const jwt = require("jsonwebtoken");
const AccountAdmin = require("../../models/account-admin.model");
const Role = require("../../models/role.model");

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email } = decode;

    const exitsAccount = await AccountAdmin.findOne({
      _id: id,
      email: email,
      status: "active",
    });

    if (!exitsAccount) {
      res.clearCookie("token");
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    }

    req.account = exitsAccount;

    //lay ra ten nhom quyen cua account
    const role = await Role.findOne({
      _id: exitsAccount.role
    })

    //Gửi account trong token sang fe = req.locals
    res.locals.account = {
      fullName: req.account.fullName,
      avatar: req.account.avatar,
      roleName: role.name,
      permissions: role.permissions
    }


    next();
  } catch (error) {
    res.clearCookie("token");
    res.redirect(`/${pathAdmin}/account/login`);
  }
};
