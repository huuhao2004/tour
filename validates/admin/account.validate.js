const Joi = require("joi");

module.exports.registerPost = async (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().min(5).max(50).messages({
      "string.empty": "Vui lòng nhập họ tên!",
      "string.min": "Họ tên phải có ít nhất 5 kí tự!",
      "strign.max": "Họ tên phải có tối đâ 50 kí tự!",
    }),

    email: Joi.string().required().email().messages({
      "string.empty": "Vui lòng nhập email của bạn!",
      "string.email": "Email không đúng định dạng",
    }),

    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helper) => {
        if (!/[A-Z]/.test(value)) {
          return helper.error("password.uppercase");
        }
        if (!/[a-z]/.test(value)) {
          return helper.error("password.lowercase");
        }
        if (!/\d/.test(value)) {
          return helper.error("password.number");
        }
        if (!/[@$?!%*]/.test(value)) {
          return helper.error("password.special");
        }
      })
      .messages({
        "string.empty": "Vui lòng nhập nhập mật khẩu",
        "string.min": "Mật khẩu phải ít nhất 8 kí tự!",
        "password.uppercase": "Mật khẩu phải chứa ít 1 chữ cái in hoa",
        "password.lowercase": "Mật khẩu phải chứa ít 1 chữ cái in thường",
        "password.number": "Mật khẩu phải chứa ít 1 chữ số",
        "password.special": "Mật khẩu phải chứa ít 1 kí tự đặc biệt"
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage
    })
    return;
  }

  next();
};

module.exports.loginPost = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email của bạn!",
        "string.email": "Email không đúng định dạng!"
      }),
    password: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu"
      }),
    rememberPassword: Joi.boolean()
  })

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage,
    });
    return;
  }

  next();
}
