const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    required: true,
  },
  minExperience: {
    type: String,
    required: true,
  },
  descriptions: {
    type: String,
    required: true,
  },
  qnrs: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  jobType: {
    type: String,
    enum: ["hyrbid", "onsite","remote"],
    default: "onsite",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const jobModel = mongoose.model("jobModel", jobSchema);
module.exports = jobModel;
