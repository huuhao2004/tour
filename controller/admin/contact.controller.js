const moment = require("moment");
const Contact = require("../../models/contact.model");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }
  const contactList = await Contact.find(find).sort({ createdAt : "desc"});
  
  for (item of contactList) {
    const createdAtFormat = moment(new Date(item.createdAt)).format("HH:mm - DD/MM/YYYY");
    item.createdAtFormat = createdAtFormat;
  }

  res.render("admin/pages/contact-list.pug", {
    pageTitle: "Thông tin liên hệ",
    contactList
  });
};
