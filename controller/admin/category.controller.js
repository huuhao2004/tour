const Category = require("../../models/category.model");

module.exports.list = (req, res) => {
  res.render("admin/pages/category-list.pug", {
    pageTitle: "Quản lý danh mục",
  });
};

module.exports.create = (req, res) => {
  res.render("admin/pages/category-create.pug", {
    pageTitle: "Tạo danh mục",
  });
};

module.exports.createPost = async (req, res) => {
  
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countCategory = await Category.countDocuments();
    req.body.position = countCategory + 1;
  }

  req.body.createdBy = req.account._id;
  req.body.updatedBy = req.account._id;

  req.body.avatar = req.file ? req.file.path : "";

  console.log(req.file);

  const newRecord = new Category(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Tạo danh mục thành công!",
  });
};
