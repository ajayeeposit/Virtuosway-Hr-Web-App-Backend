const Employee = require("../model/Employee/Employee");

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.find({});
    res.status(200).json({ employee, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal Server Error" });
  }
};

const addEmployee = async (req, res) => {
  try {
    const newEmployee = await Employee.create(req.body);
    res.status(201).json({
      newEmployee,
      success: true,
      message: "Employee Created Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "internal Server Error", error });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(201)
      .json({ employee, success: true, message: "Employee Update" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "internal Server Error", error });
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.find({ id });
    res
      .status(200)
      .json({ employee, success: true, message: "Single User", error });
  } catch (err) {
    res.status(500).json({});
  }
};
const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findOneAndDelete({ id });
    if (!employee) {
      return res.status(500).json({ message: "Employee Not Found" });
    }
    res.status(200).json({
      employee,
      success: true,
      message: "Employee Deleted Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "internal Server Error", error });
  }
};

module.exports = {
  getEmployee,
  addEmployee,
  updateEmployee,
  getEmployeeById,
  deleteEmployee,
};
