const Employee = require("./../models/Employees");
const multer = require("multer");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/../images"));
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.body.email.split("@")[0]}-${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage: multerStorage });

// const multerFilter=(req,file,cb)=>{
//   if(file.mimetype.startsWith('image')){
// cb(null,true)
//   }
//   else{
//     cb(new Error("file format not supported"),false)
//   }
// }
// Employees List with Pagination
exports.employeesList = async (req, res) => {
  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 10;
  const skip = (page - 1) * limit;
  const searchterm = req?.query?.searchterm;
  const searchCriteria = searchterm
    ? {
        $or: [
          { name: { $regex: searchterm, $options: "i" } },
          { email: { $regex: searchterm, $options: "i" } },
          { designation: { $regex: searchterm, $options: "i" } }

        ],
      }
    : {};

  try {
    const list = await Employee.find(searchCriteria).skip(skip).limit(limit);
    const totalItems = await Employee.countDocuments(searchCriteria);
    return res.status(200).json({ employees: list, length: totalItems });
  } catch (err) {
 
    return res.status(400).json({ error: "Something went wrong" });
  }
};
exports.updateEmployee = [
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, age, designation, gender, courses } = req.body;

    try {
      const updatedData = {
        name,
        email,
        mobile,
        age,
        designation,
        gender,
        courses: courses.split(",").map((course) => course.trim()),
      };

      if (req.file) {
        updatedData.image = req.file.filename;
      }
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      return res.status(200).json(updatedEmployee);
    } catch (err) {
      console.error("Error updating employee:", err);
      return res.status(500).json({ error: "Failed to update employee" });
    }
  },
];
exports.getEmployee = async (req, res) => {
  const { id } = req.params;
  const existingEmployee = await Employee.findOne({ _id: id });
  if (!existingEmployee) {
  }
  res.status(200).json(existingEmployee);
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.body;

  try {
    const result = await Employee.deleteOne({ _id: id });
 
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
exports.createEmployee = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, email, mobile, age, designation, gender, courses } =
        req.body;

      const image = req.file ? req.file.filename : null;
  
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee !== null) {
        return res.status(400).json({ error: "Employee already exists" });
      }
      const newEmployee = new Employee({
        name,
        email,
        mobile,
        age,
        designation,
        gender,
        courses: courses.split(","),
        image,
      });

      await newEmployee.save();
      return res.status(200).json(newEmployee);
    } catch (err) {
    
      return res
        .status(500)
        .json({ error: "Unable to insert the employee, try again" });
    }
  },
];
