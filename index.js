const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./routes/auth");
const Users = require("./models/Users");
const employees=require("./routes/Employees")
const path=require('path')
const app = express();
const saveAdmin=async()=>{
    const newUser=new Users({email:'laxman@gmail.com',password:"laxman"})
    await newUser.save();
}
//  saveAdmin();
app.use("/images", express.static(path.join(__dirname, "./images")));

app.use(cors());
app.use(express.json());
app.use("/employees",employees)
app.use("/auth", auth);
mongoose
  .connect("mongodb://localhost:27017/dealsdray")
  .then(() => {
    console.log("connected to db ");
  })
  .catch((err) => {n
    console.log("not connected to db");
  });


app.listen(8000, () => {
  console.log("server started");
});
