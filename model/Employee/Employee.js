const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const Employee = new mongoose.Schema({
  employeeNumber: {
    type: Number,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  dateOfJoining: {
    type: String,
    required: true,
  },
  reportingManager: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  emergencyName: {
    type: String,
  },
  emergencyContact: {
    type: String,
  },
  parentName: {
    type: String,
  },
  spouseName: {
    type: String,
  },
  projectTeam: {
    type: String,
  },
  attendanceRecords: [
    { type: mongoose.Types.ObjectId, ref: "attendancerecords" },
  ],
});

module.exports = model("Employee", Employee);
