const Tour = require("../../models/tour.model");
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
  // End section 2

  for (item of tourListSection2) {
    item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
  }

  res.render("client/pages/home.pug", {
    pageTitle: "Trang chủ",
    tourListSection2: tourListSection2
  });
}