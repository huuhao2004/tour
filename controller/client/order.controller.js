const generateHelper = require("../../helpers/generate.helper");
const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model");
const moment = require("moment");
const axios = require('axios').default;

const CryptoJS = require('crypto-js')

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
  req.body.status = "initial"; //initital, done, cancel

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
      case "zalopay":
        orderDetail.paymentMethodName = "Zalo pay"
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

module.exports.paymentZalopay = async (req, res) => {
  const orderCode = req.query.orderCode;

  const orderDetail = await Order.findOne({
    deleted: false,
    code: orderCode,
    paymentStatus: "unpaid"
  })

  if (orderDetail) {
    const apiZaloPay = "https://sb-openapi.zalopay.vn/v2/create";
    const appid = "2553";
    const key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";

    const transID = Math.floor(Math.random() * 1000000);

    const dataFinal = {
      app_id: appid,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: `${orderDetail.phone}-${orderDetail.code}`,
      app_time: Date.now(), 
      item: JSON.stringify([{}]),
      embed_data: JSON.stringify({
        redirecturl: `http://localhost:1703/order/success?orderCode=${orderDetail.code}&phone=${orderDetail.phone}`
      }),
      amount: orderDetail.total,
      description: `Thanh toán đơn hàng: ${orderDetail.code}`,
      bank_code: "",
      mac: "",
      callback_url: `http://localhost:1703/order/success/order/payment-zalopay-result`
      //khi test thì phải thay thế = url ảo của ngrok: ví dụ: https://laundry-hamper-conduit.ngrok-free.dev
    };

    const data = dataFinal.app_id + "|" + dataFinal.app_trans_id + "|" + dataFinal.app_user + "|" + dataFinal.amount + "|" + dataFinal.app_time + "|" + dataFinal.embed_data + "|" + dataFinal.item;

    dataFinal.mac = CryptoJS.HmacSHA256(data, key1).toString();


    const response = await axios.post(apiZaloPay, null, { params: dataFinal });
    
    res.redirect(response.data.order_url)

  }
  
}

module.exports.paymentZalopayResult = async (req, res) => {
  const key2 = "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz";
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, key2).toString();


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, key2);
      const [phone, orderCode] = dataJson.app_user.split('-');

      await Order.updateOne({
        phone: phone,
        code: orderCode
      }, {
        paymentStatus: "paid"
      })

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
}