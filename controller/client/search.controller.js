const Tour = require("../../models/tour.model");
const moment = require("moment");
const slugify = require("slugify");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false,
    status: "active"
  };

  // Điểm đi
  if(req.query.locationFrom){
    find.locations = req.query.locationFrom; // check req.query.locationFrom có nằm trong mảng locations hay k
  }
  // End điểm đi

  // Điểm đến(Check tiêu đề có chứa req.query.locationTo hay k)
  if (req.query.locationTo) {
    const keyword = slugify(req.query.locationTo, {
      lower: true
    });
    const keywordRegex = new RegExp(keyword);
    find.slug = keywordRegex;
  }
  // End điểm đến


  // Ngay khoi hanh
  if (req.query.departureDate) {
    const startDate = new Date(req.query.departureDate);
    find.departureDate = startDate;
  }
  // End ngay khoi hanh

  // SL hành khách
  if (req.query.stockAdult) {
    find.stockAdult = {
      $gte: parseInt(req.query.stockAdult)
    }
  }
  if (req.query.stockChildren) {
    find.stockChildren = {
      $gte: parseInt(req.query.stockChildren)
    }
  }
  if (req.query.stockBaby) {
    find.stockBaby = {
      $gte: parseInt(req.query.stockBaby)
    }
  }
  // End số lượng hành khách

  // Muc gia
  if (req.query.price) {
    const [priceMin, priceMax] = req.query.price.split("-").map(item => parseInt(item));
    find.priceNewAdult = {
      $gte: priceMin,
      $lte: priceMax
    }
  }
  // End muc gia

  const tourList = await Tour.find(find).sort({ position: "desc" });

  for (item of tourList) {
    item.departureDateFormat = moment(new Date(item.departureDate)).format("DD/MM/YYYY");
  }

  res.render("client/pages/search", {
    pageTitle: "Kết quả tìm kiếm",
    tourList: tourList
  })
}