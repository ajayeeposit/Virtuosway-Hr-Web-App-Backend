const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendancerecordSchema = new Schema({
  uid: {
    type: Number,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  recordData: [
    {
      date: Date,
      inTime: {
        type: String,
      },
      outTime: {
        type: String,
      },
    },
  ],
});

const UserRecord = mongoose.model('UserRecord', AttendancerecordSchema);
// const UserRecord = mongoose.model("UserTestRecord", AttendancerecordSchema);
module.exports = { UserRecord };
