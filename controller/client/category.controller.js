const Category = require("../../models/category.model");
const Tour = require("../../models/tour.model");
const moment = require("moment");
const City = require("../../models/city.model");

module.exports.list = async (req, res) => {
  const slug = req.params.slug;

  const category = await Category.findOne({
    slug: slug,
    deleted: false,
    status: "active"
  });

  const breadcrumb = {
    image: category.avatar,
    title: category.name,
    list: [
      {
        link: "/",
        title: "Trang chủ"
      },
    ]
  }

  if (category && category.parent) {
    const parentCategory = await Category.findOne({
      _id: category.parent,
      deleted: false,
      status: "active"
    });
    if (parentCategory) {
      breadcrumb.list.push({
        link: `${parentCategory.slug}`,
        title: parentCategory.name
      })
    }
  }

  if (category) {
    breadcrumb.list.push({
      link: `${category.slug}`,
      title: category.name
    })
  }

  // Danh sach tour
  const allCategoryChilren = [];

  const getCategoryChildren = async (parentId) => {
    const childs = await Category.find({
      parent: parentId,
      status: "active",
      deleted: false
    });

    for (const child of childs) {
      allCategoryChilren.push(child._id);
    }
  }

  await getCategoryChildren(category._id);


  const tourListSection9 = await Tour.find({
    category: { $in: [category._id, ...allCategoryChilren] },
    status: "active",
    deleted: false
  }).sort({ position: "desc" });
  
  for (item of tourListSection9) {
      item.departureDateFormat = moment(new Date(item.departureDate)).format("DD/MM/YYYY");
  }

  //bo loc
  const cityList = await City.find({});

  res.render("client/pages/tour-list", {
    pageTitle: "Danh sách tour",
    breadcrumb: breadcrumb,
    category: category,
    tourListSection9: tourListSection9,
    cityList: cityList
  });
}