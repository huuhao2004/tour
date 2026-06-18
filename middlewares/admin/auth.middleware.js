const jwt = require("jsonwebtoken");
const AccountAdmin = require("../../models/account-admin.model");

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

    //Gửi account trong token sang fe = req.locals
    res.locals.account = {
      fullName : req.account.fullName
    }


    next();
  } catch (error) {
    res.clearCookie("token");
    res.redirect(`/${pathAdmin}/account/login`);
  }
};
