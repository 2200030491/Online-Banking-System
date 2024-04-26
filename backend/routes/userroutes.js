const usercontroller = require("../controllers/usercontroller");
const express = require("express");
const userrouter = express.Router();

// Assuming insertUser is a method defined in usercontroller
userrouter.post("/insertUser", usercontroller.insertUser);

module.exports = userrouter;
