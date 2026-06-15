const mongoose = require("mongoose");

const accountAdminSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    status: {
      type: String,
      default : "initial"
    }
  }
)

const AccountAdmin = mongoose.model("AccountAdmin", accountAdminSchema, "accounts-admin");

module.exports = AccountAdmin;