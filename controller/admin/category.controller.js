const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");
const AccountAdmin = require("../../models/account-admin.model");
const moment = require("moment");
const slugify = require("slugify");
const paginationHelper = require("../../helpers/pagination.helper");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  if (req.query.createdBy) {
    find.createdBy = req.query.createdBy;
  }

  // lọc theo ngày tạo
  const dateFilter = {};
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("day").toDate();
    dateFilter.$gte = startDate;
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf("day").toDate();
    dateFilter.$lte = endDate;
  }
  if (Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }

  // end lọc theo ngày tạo

  //search
  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true,
    });
    const keywordRegex = new RegExp(keyword);
    find.slug = keywordRegex;
  }
  // end search

  // pagintaion
  const countCategory = await Category.countDocuments({ deleted: false });
  const objectPagination = paginationHelper(req.query, countCategory);
  // end pagination

  const categoryList = await Category.find(find)
    .sort({
      position: "desc",
    })
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem);

  for (const item of categoryList) {
    if (item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findById(item.createdBy);
      item.createdByFullName = infoAccountCreated.fullName;
    }
    if (item.updatedBy) {
      const infoAccountUpdated = await AccountAdmin.findById(item.updatedBy);
      item.updatedByFullName = infoAccountUpdated.fullName;
    }
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
  }

  // danh sách tài khoản quản trị
  const accountAdminList = await AccountAdmin.find({}).select("_id fullName");

  // end danh sách tài khoản quản trị

  res.render("admin/pages/category-list.pug", {
    pageTitle: "Quản lý danh mục",
    categoryList: categoryList,
    accountAdminList: accountAdminList,
    objectPagination: objectPagination,
  });
};

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({});

  const categoryTree = categoryHelper(categoryList, "");

  // res.json({
  //   categoryTree: categoryTree,
  // });

  res.render("admin/pages/category-create.pug", {
    pageTitle: "Tạo danh mục",
    categoryTree: categoryTree,
  });
};

module.exports.createPost = async (req, res) => {
  if (req.role.permissions.includes("category-create")) {
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

    req.flash("success", "Tạo danh mục thành công!");

    res.json({
      code: "success",
      message: "Tạo danh mục thành công!",
    });
  } else {
    res.json({
      code: "error",
      message: "Không có quyền!"
    })
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const categoryDetail = await Category.findOne({
      _id: id,
      deleted: false,
    });

    const categoryList = await Category.find({ deleted: false });

    const categoryTree = categoryHelper(categoryList, "");

    res.render("admin/pages/category-edit.pug", {
      pageTitle: "Chỉnh sửa danh mục",
      categoryTree: categoryTree,
      categoryDetail: categoryDetail,
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/${pathAdmin}/category/list`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    if (req.role.permissions.includes("category-edit")) {
      const id = req.params.id;

      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      } else {
        const countCategory = await Category.countDocuments();
        req.body.position = countCategory + 1;
      }

      req.body.updatedBy = req.account._id;

      if (req.file) {
        req.body.avatar = req.file.path;
      } else {
        delete req.body.avatar; // xóa req.body.avatar khỏi req.body đẻ khỏi cập nhật thành ""
      }

      await Category.updateOne(
        {
          _id: id,
          deleted: false,
        },
        req.body,
      );

      req.flash("success", "Cập nhật danh mục thành công!");

      res.json({
        code: "success",
        message: "Cập nhật danh mục thành công!",
      });
    } else {
      res.json({
        code: "error"
      })
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.deletePatch = async (req, res) => {
  try {
    if (req.role.permissions.includes("category-delete")) {
      const id = req.params.id;

      await Category.updateOne(
        {
          _id: id,
        },
        {
          deleted: true,
          deletedBy: req.account._id,
          deletedAt: Date.now(),
        },
      );

      req.flash("success", "Xóa danh mục thành công!");

      res.json({
        code: "success",
        message: "Xóa danh mục thành công!",
      });
    } else {
      res.json({
        code: "error"
      })
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, option } = req.body;

    if (option == "active" || option == "inactive") {
      await Category.updateMany(
        {
          _id: { $in: ids },
        },
        {
          status: option,
        },
      );
      req.flash("success", "Thay đổi trạng thái danh mục thành công!");
    } else if (option == "delete") {
      await Category.updateMany(
        {
          _id: { $in: ids },
        },
        {
          deleted: true,
          deletedAt: Date.now(),
          deletedBy: req.account._id,
        },
      );
      req.flash("success", "Xóa danh mục thành công!");
    }
    res.json({
      code: "success",
      message: "Thay đổi trạng thái thành công!",
    });
  } catch (error) {
    console.log(error);
  }
};
