const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { auth } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const express = require("express");
const { productModel } = require("../models/products.model");
const { userModel } = require("../models/user.model");
const userRouter = express.Router();
userRouter.use(express.json());

// REGISTER ROUTE
userRouter.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await userModel.find({ email });
    {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.send({ msg: "something went wrong" });
        } else {
          const user = new userModel({ name, email, role, password: hash });
          await user.save();
          res.send({ msg: "new user registered" });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// LOGIN ROUTER
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          let maintoken = jwt.sign(
            { userID: user[0]._id, role: user[0].role },
            process.env.mainkey,
            // expire time is in millisecounds
            { expiresIn: 60000 }
          );
          let reftoken = jwt.sign({ userID: user[0]._id }, process.env.refkey, {
            expiresIn: 300000,
          });
          res.send({
            msg: "logedin",
            maintoken: maintoken,
            reftoken: reftoken,
          });
        } else {
          res.send({ msg: "wrong credentials" });
        }
      });
    } else {
      res.send({ msg: "wrong credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// logout route
userRouter.get("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const blacklistdata = JSON.parse(
    fs.readFileSync("./blacklist.json", "utf-8")
  );
  blacklistdata.push(token);
  fs.writeFileSync("./blacklist.json", JSON.stringify(blacklistdata));
  res.send({ msg: "user loged out" });
});

// refresh token
userRouter.get("/newtoken", async (req, res) => {
  var reftoken = req.headers.authorization?.split(" ")[1];
  if (!reftoken) {
    res.send({ msg: "login again" });
  } else {
    jwt.verify(reftoken, process.env.refkey, (err, decoded) => {
      if (decoded) {
        let user = decoded;
        let maintoken = jwt.sign({ userID: user.userID }, process.env.mainkey, {
          expiresIn: 1,
        });
        res.send({ msg: "login sucessful", maintoken: maintoken });
      } else {
        console.log(err);
        res.send({ msg: "something went wrong" });
      }
    });
  }
});

// Products endpoint
userRouter.get("/products", auth, async (req, res) => {
  const product = await productModel.find(req.query);
  res.send({ data: product });
});

module.exports = { userRouter };

