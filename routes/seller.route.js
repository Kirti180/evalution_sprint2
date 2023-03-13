const mongoose = require("mongoose");
const express = require("express");
const { authorize } = require("../middleware/authorize");
const { auth } = require("../middleware/auth");
const { productModel } = require("../models/products.model");
const productRouter = express.Router();
productRouter.use(express.json());
// ADDPRODUCT
productRouter.post(
  "/addproducts",
  auth,
  authorize(["seller"]),
  async (req, res) => {
    const product = new productModel(req.body);
    await product.save();
    res.send({ msg: "new product added" });
  }
);

// DELETE PRODUCT
productRouter.delete(
  "/deleteproducts/:id",
  auth,
  authorize(["seller"]),
  async (req, res) => {
    const productId = req.params.id;
    await productModel.findByIdAndDelete({ _id: productId });
    res.send({ msg: "product deleted" });
  }
);

module.exports = { productRouter };
