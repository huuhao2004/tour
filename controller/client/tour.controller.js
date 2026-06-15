module.exports.list = (req, res) => {
  res.render("client/pages/tour-list", {
    pageTitle: "Danh sách tour",
  });
};

module.exports.detail = (req, res) => {
  res.render("client/pages/detail-tour", {
    pageTitle: "Chi tiết tour",
  });
};
