const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicantSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postal: {
      type: Number,
      required: true,
    },
    github: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    jobId:{
      type:String,
      required:true,
    }
  },
  {
    timestamps: true,
  }
);

const applicantModel = mongoose.model("applicantModel", applicantSchema);
module.exports = applicantModel;
