const Tour = require("../../models/tour.model");
const Category = require("../../models/category.model");
const City = require("../../models/city.model");
const moment = require("moment");

module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const tourDetail = await Tour.findOne({
    slug: slug,
    deleted: false,
    status: "active"
  });

  if (tourDetail) {
    const category = await Category.findOne({
      _id: tourDetail.category,
      deleted: false,
      status: "active"
    })
    const breadcrumb = {
      image: category.avatar,
      title: tourDetail.name,
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
          link: `/category/${parentCategory.slug}`,
          title: parentCategory.name
        })
      }
    }

    if (category) {
      breadcrumb.list.push({
        link: `/category/${category.slug}`,
        title: category.name
      })
    }

    breadcrumb.list.push({
      link: `/tour/detail/${slug}`,
      title: tourDetail.name
    })

    //thong tin chi tiet
    tourDetail.departureDateFormat = moment(tourDetail.departureDate).format('DD/MM/YYYY');

    const cityList = await City.find({
      _id: {
        $in: tourDetail.locations
      }
    })
    //end thong tin chi tiet

    res.render("client/pages/detail-tour", {
      pageTitle: "Chi tiết tour",
      breadcrumb: breadcrumb,
      tourDetail: tourDetail,
      cityList: cityList
    });
  } else {
    res.redirect("/")
  }
};
