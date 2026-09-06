const generateHelper = require("../../helpers/generate.helper");
const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model");
const moment = require("moment");

module.exports.createPost = async (req, res) => {
  //mã đơn hàng
  req.body.code = "OD" + generateHelper.generateRandomRumber(10);
  //ds tour
  for (const item of req.body.items) {
    const tourInfo = await Tour.findOne({
      _id: item.tourId
    })
    //them gia
    item.priceNewAdult = tourInfo.priceNewAdult;
    item.priceNewChildren = tourInfo.priceNewChildren;
    item.priceNewBaby = tourInfo.priceNewBaby;
    //them ngay khoi hanh
    item.departureDate = tourInfo.departureDate;

    //cap nhat sol con lai cua tour
    await Tour.updateOne({
      _id: item.tourId
    }, {
      stockAdult: tourInfo.stockAdult - item.quantityAdult,
      stockChildren: tourInfo.stockChildren - item.quantityChildren,
      stockBaby: tourInfo.stockBaby - item.quantityBaby,
    })
  }

  //thanh toan

  //tam tinh
  let subTotal = 0;
  for (const item of req.body.items) {
    subTotal += (item.priceNewAdult * item.quantityAdult + item.priceNewBaby * item.quantityBaby + item.priceNewChildren * item.quantityChildren);
  }
  req.body.subTotal = subTotal;
  //tong tien
  req.body.total = req.body.subTotal;

  //trang thai thanh toan
  req.body.paymentStatus = "unpaid"; //unpaid = chua thanh toan, paid: da thanh toan
  //trang thai don hang
  req.body.status = "initial"; //initital, done, cancle

  const newRecord = new Order(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Đặt hàng thành công!",
    orderCode: req.body.code
  })
}

module.exports.success = async (req, res) => {
  const { orderCode, phone } = req.query;

  const orderDetail = await Order.findOne({
    code: orderCode,
    phone: phone
  });

  if (orderDetail) {
    switch (orderDetail.paymentMethod) {
      case "money":
        orderDetail.paymentMethodName = "Thanh toán bằng tiền mặt"
        break;
      case "momo":
        orderDetail.paymentMethodName = "Ví momo"
        break;
      case "bank":
        orderDetail.paymentMethodName = "Chuyển khoản ngân hàng"
        break;
    }
    switch (orderDetail.paymentStatus) {
      case "unpaid":
        orderDetail.paymentStatusName = "Chưa thanh toán"
        break;
      case "paid":
        orderDetail.paymentStatusName = "Đã thanh toán"
        break;
    }
    switch (orderDetail.status) {
      case "initial":
        orderDetail.statusName = "Khởi tạo"
        break;
      case "done":
        orderDetail.statusName = "Hoàn thành"
        break;
      case "cancle":
        orderDetail.statusName = "Hủy"
        break;
    }

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");

    for (const item of orderDetail.items) {
      const tourInfo = await Tour.findOne({
        _id: item.tourId
      })
      if (tourInfo) {
        item.avatar = tourInfo.avatar;
        item.name = tourInfo.name;
        item.slug = tourInfo.slug;
        item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
      };

    }

    res.render("client/pages/order-success", {
      pageTitle: "Đặt hàng thành công!",
      orderDetail
    });
  } else {
    res.redirect("/")
  }


}