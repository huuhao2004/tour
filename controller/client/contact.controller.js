const Contact = require("../../models/contact.model");

module.exports.createPost = async (req, res) => {
  const { email } = req.body;

  const exitsEmail = await Contact.findOne({
    email: email,
    deleted: false
  });

  if (exitsEmail) {
    //req.flash("error", "Email của bạn đã được đăng ký!")
    res.json({
      code: "error",
      message: "Email của bạn đã được đăng ký!"
    });
    return;
  };

  const newRecord = new Contact(req.body);
  await newRecord.save();

  req.flash("success", "Bạn đã đăng ký thành công!");

  res.json({
    code: "success"
  })
}