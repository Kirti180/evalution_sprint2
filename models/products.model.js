const mongoose = require("mongoose");
productSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  desc: {
    type: String,
    require: true,
  },
  brand: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
});
productModel = mongoose.model("product", productSchema);
module.exports = { productModel };
