const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: String,
    parent: String,
    position: Number,
    avatar: String,
    description: String,
    createdBy: String,
    updatedBy: String,
    slug: String,
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

const Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;