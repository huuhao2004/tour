const SettingWebsiteInfo = require("../../models/setting-website-info.model");

module.exports.websiteInfo = async (req, res, next) => {
  const settingSettingInfo = await SettingWebsiteInfo.findOne({});

  res.locals.settingSettingInfo = settingSettingInfo;

  next();
}