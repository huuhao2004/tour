const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");
const City = require("../../models/city.model");
const Tour = require("../../models/tour.model");
const AccountAdmin = require("../../models/account-admin.model");
const moment = require("moment");
const priceRangeHelper = require("../../helpers/price.helper");
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

  // filter category
  if (req.query.category) {
    find.category = req.query.category;
  }

  // filter price
  if (req.query.price) {
    const { min, max } = priceRangeHelper[req.query.price];

    const price = {
      $cond: {
        // Nếu newPrice bằng chuỗi rỗng "" (hoặc có thể thêm null nếu cần)
        if: {
          $or: [
            { $eq: ["$priceNewAdult", ""] },
            { $eq: ["$priceNewAdult", null] },
            { $eq: ["$priceNewAdult", 0] },
          ],
        },
        // Thì lấy oldPrice
        then: "$priceAdult",
        // Nếu không thì lấy newPrice
        else: "$priceNewAdult",
      },
    }; //
    // 3. Đưa logic tính toán vào $expr để so sánh với min và max
    find.$expr = {
      $and: [{ $gte: [price, min] }, { $lte: [price, max] }],
    };
  }

  // search
  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true,
    });
    const keywordRegex = new RegExp(keyword);
    find.slug = keywordRegex;
  }

  // pagintaion
  const countTour = await Tour.countDocuments({ deleted: false });
  const objectPagination = paginationHelper(req.query, countTour);
  // end pagination

  const categoryList = await Category.find({ deleted: false });
  const tourList = await Tour.find(find)
    .sort({ position: "desc" })
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem);
  const accountAdminList = await AccountAdmin.find({}).select("_id fullName");
  const categoryTree = categoryHelper(categoryList, "");

  for (const item of tourList) {
    if (item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy,
      });
      item.createdByFullName = infoAccountCreated.fullName;
    }
    if (item.updatedBy) {
      const infoAccountUpdated = await AccountAdmin.findOne({
        _id: item.updatedBy,
      });
      item.updatedByFullName = infoAccountUpdated.fullName;
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render("admin/pages/tour-list.pug", {
    pageTitle: "Quản lý tour",
    tourList: tourList,
    accountAdminList: accountAdminList,
    categoryList: categoryTree,
    objectPagination: objectPagination,
  });
};

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false,
  });

  const categoryTree = categoryHelper(categoryList, "");

  const cityList = await City.find({});

  res.render("admin/pages/tour-create.pug", {
    pageTitle: "Tạo tour",
    categoryList: categoryTree,
    cityList: cityList,
  });
};

module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countTour = await Tour.countDocuments();
    req.body.position = countTour + 1;
  }

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : "";

  req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
  req.body.priceChildren = req.body.priceChildren
    ? parseInt(req.body.priceChildren)
    : 0;
  req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;

  req.body.priceNewAdult = req.body.priceNewAdult
    ? parseInt(req.body.priceNewAdult)
    : 0;
  req.body.priceNewChildren = req.body.priceNewChildren
    ? parseInt(req.body.priceNewChildren)
    : 0;
  req.body.priceNewBaby = req.body.priceNewBaby
    ? parseInt(req.body.priceNewBaby)
    : 0;

  req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
  req.body.stockChildren = req.body.stockChildren
    ? parseInt(req.body.stockChildren)
    : 0;
  req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;

  req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
  req.body.departureDate = req.body.departureDate
    ? new Date(req.body.departureDate)
    : null;
  req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

  const newTour = new Tour(req.body);
  await newTour.save();

  req.flash("success", "Tạo tour thành công!");

  res.json({
    code: "success",
    messge: "Tạo tour thành công!",
  });
};

module.exports.changeMulti = async (req, res) => {
  try {
    const { option, ids } = req.body;
    if (option == "active" || option == "inactive") {
      await Tour.updateMany(
        {
          _id: { $in: ids },
        },
        {
          status: option,
        },
      );
      req.flash("message", "Cập nhật trạng thái tour thành công!");
    } else if (option == "delete") {
      await Tour.updateMany(
        {
          _id: { $in: ids },
        },
        {
          deleted: true,
          deletedAt: Date.now(),
          deletedBy: req.account._id,
        },
      );
      req.flash("message", "Xóa tour thành công!");
    }
    res.json({
      code: "success",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const tourDetail = await Tour.findOne({ _id: id });

    const date = new Date(tourDetail.departureDate);
    tourDetail.departureDateFormat = moment(date).format("YYYY-MM-DD");

    const categoryList = await Category.find({
      deleted: false,
    });

    const categoryTree = categoryHelper(categoryList, "");

    const cityList = await City.find({});

    res.render("admin/pages/tour-edit.pug", {
      pageTitle: "Chỉnh sửa tour",
      categoryList: categoryTree,
      cityList: cityList,
      tourDetail: tourDetail,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countTour = await Tour.countDocuments();
      req.body.position = countTour + 1;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;

    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar; // xóa req.body.avatar khỏi req.body đẻ khỏi cập nhật thành ""
    }

    req.body.priceAdult = req.body.priceAdult
      ? parseInt(req.body.priceAdult)
      : 0;
    req.body.priceChildren = req.body.priceChildren
      ? parseInt(req.body.priceChildren)
      : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;

    req.body.priceNewAdult = req.body.priceNewAdult
      ? parseInt(req.body.priceNewAdult)
      : 0;
    req.body.priceNewChildren = req.body.priceNewChildren
      ? parseInt(req.body.priceNewChildren)
      : 0;
    req.body.priceNewBaby = req.body.priceNewBaby
      ? parseInt(req.body.priceNewBaby)
      : 0;

    req.body.stockAdult = req.body.stockAdult
      ? parseInt(req.body.stockAdult)
      : 0;
    req.body.stockChildren = req.body.stockChildren
      ? parseInt(req.body.stockChildren)
      : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;

    req.body.locations = req.body.locations
      ? JSON.parse(req.body.locations)
      : [];
    req.body.departureDate = req.body.departureDate
      ? new Date(req.body.departureDate)
      : null;
    req.body.schedules = req.body.schedules
      ? JSON.parse(req.body.schedules)
      : [];

    await Tour.updateOne({ _id: id }, req.body);

    req.flash("success", "Sửa tour thành công!");

    res.json({
      code: "success",
      messge: "Sửa tour thành công!",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.trash = (req, res) => {
  res.render("admin/pages/tour-trash.pug", {
    pageTitle: "Thùng rác tour",
  });
};
