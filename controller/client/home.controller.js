const Tour = require("../../models/tour.model");
const Category = require("../../models/category.model");
const moment = require("moment");

module.exports.home = async (req, res) => {
  // Section 2
  const tourListSection2 = await Tour.find({
    priceAdult: { $gt: 0 }, //loc tour có giá người lớn > 0
    deleted: false,
    status: "active"
  }).sort({
    position: "desc"
  }).limit(6);
  for (item of tourListSection2) {
    item.departureDateFormat = moment(new Date(item.departureDate)).format("DD/MM/YYYY");
  }
  // End section 2

  // Section 4: Tour trong nước
  const categorySection4 = await Category.findOne({ slug: "tour-trong-nuoc" });
  const categoryIdSection4 = categorySection4._id.toString();
  const listCategory = [categoryIdSection4];

  const listSubCategory = await Category.find({
    parent: categoryIdSection4,
    deleted: false,
    status: "active"
  });

  for (const item of listSubCategory) {
    listCategory.push(item._id);
  }
  
  const tourListSection4 = await Tour.find({
    category: {$in: listCategory},
    deleted: false,
    status: "active"
  }).sort({ position: "desc" }).limit(8);

  for (item of tourListSection4) {
    item.departureDateFormat = moment(new Date(item.departureDate)).format("DD/MM/YYYY");
  }
  // End section 4: Tour trong nước

  res.render("client/pages/home.pug", {
    pageTitle: "Trang chủ",
    tourListSection2: tourListSection2,
    tourListSection4: tourListSection4
  });
}