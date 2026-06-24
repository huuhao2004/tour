const Joi = require("joi");

module.exports.websiteInfoPatch = (req, res, next) => {
  const schema = Joi.object({
    websiteName: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập tên website",
    }),
    phone: Joi.string().allow(""),
    email: Joi.string().allow(""),
    address: Joi.string().allow(""),
    logo: Joi.string().allow(""),
    favicon: Joi.string().allow(""),
  });

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
};

module.exports.roleCreatePost = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập tên quyền",
    }),
    description: Joi.string().allow(""),
    permissions: Joi.array().items(Joi.string()).default([]),
  });

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
};

module.exports.roleEditPatch = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập tên quyền",
    }),
    description: Joi.string().allow(""),
    permissions: Joi.array().items(Joi.string()).default([]),
  });

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
};


