const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  id: Number,
  title: String,
});

const Tour = mongoose.model("Product", tourSchema, "tours");

module.exports = Tour;
