const mongoose = require("mongoose");

const accountAdminSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    role: String,
    positionCompany: String,
    status: {
      type: String,
      default: "initial"
    },
    password: String,
    avatar: String,
    createdBy: String,
    updatedBy: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  }, {
    timestamps: true
  }
)

const AccountAdmin = mongoose.model("AccountAdmin", accountAdminSchema, "accounts-admin");

module.exports = AccountAdmin;