const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please provide a valid 10-digit mobile number"],
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Age must be at least 18"],
    },
    designation: {
      type: String,
      enum: ["Hr", "Manager", "Sales"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    courses: {
      type: [String],
      enum: ["BCA", "MCA", "BSC"], 
      default: [],
    },
    image: {
      type: String, 
      default: null,
    },
   createdAt: {
      type:Date,
      default:Date.now()
    }
  }
 
);


const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
