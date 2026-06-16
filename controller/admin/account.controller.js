const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const AccountAdmin = require("../../models/account-admin.model");

module.exports.login = (req, res) => {
  res.render("admin/pages/login.pug", {
    pageTitle: "Đăng nhập",
  });
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  const exitsAccount = await AccountAdmin.findOne({
    email: email
  })

  if (!exitsAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!"
    })
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, exitsAccount.password);
  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng!",
    });
    return;
  }

  //check tài khoản đã được kích hoạt hay chưa
  if (exitsAccount.status != "active") {
    res.json({
      code: "error",
      message: "Tài khoản chưa đưuọc kích hoạt!",
    });
    return;
  }

  //jwt 
  const token = jwt.sign(
    {
      id: exitsAccount._id,
      email: exitsAccount.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true, //chỉ cho phép server được truy cập cookie này
    sameSit: "strict" // không gửi đc yêu cầu từ website khác
  })

  res.json({
    code: "success",
    message: "Đăng nhập tài khoản thành công!"
  })
};

module.exports.register = (req, res) => {
  res.render("admin/pages/register.pug", {
    pageTitle: "Đăng ký",
  });
};

module.exports.registerPost = async (req, res) => {
  const { fullName, email, password } = req.body;

  const exitsAccount = await AccountAdmin.findOne({
    email: email
  })

  if (exitsAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    })
    return;
  }

  //hash password
  const salt = await bcrypt.genSalt(10); // tạo chuỗi ngẫu nhiên có 10 kí tự
  const hashPassword = await bcrypt.hashSync(password, salt);

  const newAccount =  new AccountAdmin({
    fullName,
    email: email,
    password: hashPassword
  })

  await newAccount.save();

  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công!"
  })
};

module.exports.registerInitial = (req, res) => {
  res.render("admin/pages/register-initial.pug", {
    pageTitle: "Tài khoản đã được khởi tạo!"
  });
}

module.exports.forgotPassword = (req, res) => {
  res.render("admin/pages/forgot-password.pug", {
    pageTitle: "Quên mật khẩu",
  });
};

module.exports.otpPassword = (req, res) => {
  res.render("admin/pages/otp-password.pug", {
    pageTitle: "Nhập mã OTP",
  });
};

module.exports.resetPassword = (req, res) => {
  res.render("admin/pages/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};

module.exports.logoutPost = (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  })
}