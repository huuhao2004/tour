const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateHelper = require("../../helpers/generate.helper");
const mailHelper = require("../../helpers/mail.helper");


const AccountAdmin = require("../../models/account-admin.model");
const ForgotPassword = require("../../models/forgot-password");

module.exports.login = (req, res) => {
  res.render("admin/pages/login.pug", {
    pageTitle: "Đăng nhập",
  });
};

module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body;

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
      expiresIn: rememberPassword ? "7d" : "1d",
    },
  );

  res.cookie("token", token, {
    maxAge: rememberPassword ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    httpOnly: true, //chỉ cho phép server được truy cập cookie này
    sameSit: "strict", // không gửi đc yêu cầu từ website khác
  });

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

module.exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;
  
  //check email
  const exitsAccount = await AccountAdmin.findOne({
    email: email
  });

  if (!exitsAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!"
    })
    return;
  }

  //tạo mã otp
  const otp = generateHelper.generateRandomRumber(6);

  //check email đã tồn tại trong forgot-password hay chưa
  const exitsEmailInForgotPassword = await ForgotPassword.findOne({
    email: email,
  });

  if (exitsEmailInForgotPassword) {
    res.json({
      code: "error",
      message: "Vui lòng gửi lại yêu cầu sau 5 phút!",
    });
    return;
  }

  // lưu vào database email và otp, sau 5 phút tự xóa bản ghi
  const record = new ForgotPassword({
    email: email,
    otp: otp,
    expireAt: Date.now() + 5 * 60 * 1000
  })

  await record.save();

  // gửi email tự động cho người dùng
  const subject = `Mã OTP lấy lại mật khẩu!`;
  const content = `Mã OTP của bạn là <b>${otp} </b> <br> Mã OTP có hiệu lực trong 5 phút.Vui lòng không chia sẽ cho bất kỳ ai!`
  mailHelper.sendMailer(email, subject, content);

  res.json({
    code: "success",
    message: "Đã gửi mã OTP qua email!"
  })
};

module.exports.otpPassword = (req, res) => {
  res.render("admin/pages/otp-password.pug", {
    pageTitle: "Nhập mã OTP",
  });
};

module.exports.otpPasswordPost = async (req, res) => {
  const { email, otp } = req.body;

  const exitsRecord = await ForgotPassword.findOne({
    otp: otp,
    email: email,
  });

  if (!exitsRecord) {
    res.json({
      code: "error",
      message: "Mã OTP không chính xác!",
    });
    return;
  }

  const exitsAccount = await AccountAdmin.findOne({
    email: email
  })

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
    sameSit: "strict", // không gửi đc yêu cầu từ website khác
  });

  res.json({
    code: "success",
    message: "Xác thực OTP thành công!",
  });
};;

module.exports.resetPassword = (req, res) => {
  res.render("admin/pages/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};

module.exports.resetPasswordPost = async (req, res) => {
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  await AccountAdmin.updateOne({
    _id: req.account._id
  }, {
    password: hashPassword
  })

  res.json({
    code: "success",
    message: "Đổi mật khẩu thành công!",
  });
};


module.exports.logoutPost = (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  })
}