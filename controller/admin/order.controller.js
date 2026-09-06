const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

  const orderList = await Order.find(find).sort({
    createdAt: "desc"
  });

  for (const orderDetail of orderList) {
    for (const item of orderDetail.items) {
      const tourInfo = await Tour.findOne({
        _id: item.tourId
      });
      if (tourInfo) {
        item.avatar = tourInfo.avatar;
        item.name = tourInfo.name;
      }
    }
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
      case "cancel":
        orderDetail.statusName = "Hủy"
        break;
    }

    orderDetail.createdAtFormatTime = moment(orderDetail.createdAt).format("HH:mm");
    orderDetail.createdAtFormatDate = moment(orderDetail.createdAt).format("DD/MM/YYYY");
  }

  res.render("admin/pages/order-list.pug", {
    pageTitle: "Quản lý đơn hàng",
    orderList: orderList
  });
};


module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const orderDetail = await Order.findOne({
      _id: id
    })

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("YYYY-MM-DDTHH:mm");

    for (const item of orderDetail.items) {
      const tourInfo = await Tour.findOne({
        _id: item.tourId
      });
      if (tourInfo) {
        item.avatar = tourInfo.avatar;
        item.name = tourInfo.name;
        item.departureDateFormat = moment(tourInfo.departureDate).format("DD/MM/YYYY");
      }
    }

    res.render("admin/pages/order-edit.pug", {
      pageTitle: `Đơn hàng: ${orderDetail.code}`,
      orderDetail
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/order/list`)
  }
};


module.exports.editPatch = async (req, res) => {
  try{
    const id = req.params.id;

    await Order.updateOne({
      _id: id
    }, req.body);

    req.flash("success", "Cập nhật đơn hàng thành công!");
    res.json({
      code: "success"
    })
  }catch (error) {
    res.redirect(`/${pathAdmin}/order/list`)
  }
}