const express=require("express")
const Router=express.Router()
const employeeControllers =require("./../controllers/employees")
Router.get("/",employeeControllers.employeesList)
Router.delete("/",employeeControllers.deleteEmployee)
Router.get("/:id",employeeControllers.getEmployee);
Router.put("/:id",employeeControllers.updateEmployee)
Router.post("/",employeeControllers.createEmployee);
module.exports=Router
// const express = require("express");
// const Router = express.Router();
// const employeeControllers = require("../controllers/employees"); // Adjust the path if necessary

// // GET route for employee list
// Router.get("/list", employeeControllers.employees);  // Make sure the function name matches

// module.exports = Router;
