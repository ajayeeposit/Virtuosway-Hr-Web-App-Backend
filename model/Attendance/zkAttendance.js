const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set('strictQuery', false);

const ZkAttendancerecordSchema = new Schema({
  userSn: {
    type: Number,
  },
  attendanceByDate: [
    {
      date: String,
      entryTime: {
        type: String,
      },
      exitTime: {
        type: String,
      },
      workHour: {
        type: String,
      },
      moringStatus: {
        type: String,
      },
      eveningStatus: {
        type: String,
      },
      absent: {
        default: false,
        type: Boolean,
        required: true,
      },
      holiday: {
        default: false,
        required: true,
        type: Boolean,
      },
    },
  ],
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    strictPopulate: false,
  },
});

const ZkUserRecord = mongoose.model(
  "attendancerecords",
  ZkAttendancerecordSchema
);
const OldOfficeSchema = mongoose.model(
  "OldOfficeData",
  ZkAttendancerecordSchema
);
const NewOfficeSchema = mongoose.model(
  "NewOfficeData",
  ZkAttendancerecordSchema
);
module.exports = { ZkUserRecord, OldOfficeSchema, NewOfficeSchema };
