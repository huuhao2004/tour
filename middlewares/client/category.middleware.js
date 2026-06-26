const Category = require("../../models/category.model");
const categoryHelperTree = require("../../helpers/category.helper");

module.exports.list = async (req, res, next) => {
  const categoryList = await Category.find({
    deleted: false,
    status: "active"
  });

  const categoryTree = categoryHelperTree(categoryList);

  res.locals.categoryList = categoryTree;
  next();
} 