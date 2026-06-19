const { types } = require("joi");
const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
  
mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
  {
    name: String,
    slug: {
      type: String,
      slug: "name",
      unique: true
    },
    parent: String,
    position: Number,
    avatar: String,
    description: String,
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

const Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;