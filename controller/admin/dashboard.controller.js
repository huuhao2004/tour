const AccountAdmin = require("../../models/account-admin.model");
const Order = require("../../models/order.model");

module.exports.dashboard = async (req, res) => {
  //thong so
  const overview = {
    totalUser: 0,
    totalOrder: 0,
    totalRevenue: 0
  }

  const orderList = await Order.find({
    deleted: false
  })

  const userAdminList = await AccountAdmin.find({
    deleted: false
  });

  overview.totalUser = orderList.length;
  overview.totalOrder = orderList.length;
  overview.totalRevenue = orderList.reduce((sum, item) => sum + item.total, 0);

  res.render("admin/pages/dashboard.pug", {
    pageTitle: "Tổng quan",
    overview
  });
};


module.exports.revenueChartPost = async (req, res) => {
  const { currentMonth, currentYear, previousMonth, previousYear, arrayDay } = req.body;

  const odersCurrentMonth = await Order.find({
    deleted: false,
    createdAt: {
      $gte: new Date(currentYear, currentMonth - 1, 1),
      $lt: new Date(currentYear, currentMonth, 1),
    }
  });

  const odersPreviousMonth = await Order.find({
    deleted: false,
    createdAt: {
      $gte: new Date(previousYear, previousMonth - 1, 1),
      $lt: new Date(previousYear, previousMonth, 1),
    }
  })

  const dataMonthCurrent = [];
  const dataMonthPrevious = [];

  for (const day of arrayDay) {
    let revenueCurrent = 0;
    for (const order of odersCurrentMonth) {
      const orderDate = new Date(order.createdAt).getDate();
      if (orderDate == day) {
        revenueCurrent += order.total;
      }
    };
    dataMonthCurrent.push(revenueCurrent);

    let revenuePrevious = 0;
    for (const order of odersPreviousMonth) {
      const orderDate = new Date(order.createdAt).getDate();
      if (orderDate == day) {
        revenuePrevious += order.total;
      }
    };;
    dataMonthPrevious.push(revenuePrevious);
  }

  res.json({
    code: "success",
    dataMonthCurrent,
    dataMonthPrevious
  })
}