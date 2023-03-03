const ZKLib = require("qr-zklib");
const dotenv = require("dotenv");
const {
  ZkUserRecord,
} = require("../../model/Attendance/zkAttendance");
const Employee = require("../../model/Employee/Employee");
const {
  getPayRollDate,
  getSaturdaysAndSundays,
} = require("../../services/DateServices");
const NepaliDate = require("nepali-date-converter");
const { getAttendanceData } = require("../../services/getAttendanceData");
dotenv.config({ path: "../config.env" });


//update user attendance record
const zkAttendanceUSerRecord = async (req, res) => {
  const zkInstance1 = new ZKLib(process.env.OLD_OFFICE, 4370, 5200, 5000); //Old Office
  const zkInstance2 = new ZKLib(process.env.NEW_OFFICE, 4370, 5200, 5000); //New Office
  try {
    const officeRecord = await getAttendanceData(
      zkInstance1,
      zkInstance2,
      ZkUserRecord
    );
    res.status(200).json({ officeRecord });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

//get user attendance record
const getzkAttendanceUSerRecord = async (req, res) => {
  try {
    const attendance = await ZkUserRecord.find({}).exec();
    res.status(200).json(attendance);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong", e });
  }
};

// controller function to create monthly Report of Employee
const getUserMonthlyReport = async (req, res) => {
  const date = new NepaliDate();
  const year = date.getYear();
  const month = date.getMonth();
  try {
    const userRecord = await ZkUserRecord.find();
    const employees = await Employee.find().sort({ employeeName: 1 });
    const employeeDatas = employees.map((employee) => {
      return { num: employee.employeeNumber, name: employee.employeeName };
    });
    if (!userRecord) {
      return res.status(404).json({ error: "User record not found" });
    }
    const weekend = getSaturdaysAndSundays(year, month);
    const payRollDate = getPayRollDate();
    const workDays = payRollDate - weekend;
    const userData = await Promise.all(
      employeeDatas.map(async (employeeData) => {
        const { num, name } = employeeData;
        const userSn = num;
        const attendanceRecords = await ZkUserRecord.find({ userSn });
        const monthlyData = groupAttendanceRecordsByMonth(attendanceRecords);
        const payRollData = monthlyData.map((monthData) => {
          const { monthName, attendanceByDate } = monthData;
          const absentDays = attendanceByDate.filter(
            (record) => record.absent
          ).length;
          const presentDays = attendanceByDate.filter(
            (record) => !record.absent && !record.holiday
          ).length;
          return {
            userSn,
            name,
            monthName,
            payRollDate,
            weekend,
            workDays,
            presentDays,
            absentDays,
          };
        });
        return payRollData;
      })


    );
    return res.status(200).json({ userData });
  } catch (err) {
    return res.status(500).json({ error: "Server error", err });
  }
};

//get month wise attendance of employee
const groupAttendanceRecordsByMonth = (attendanceRecords) => {
  const groupedData = {};
  attendanceRecords.forEach((record) => {
    record.attendanceByDate.map((data) => {
      const date = new NepaliDate(data.date);
      const monthName = date.getMonth();
      if (!groupedData[monthName]) {
        groupedData[monthName] = {
          monthName,
          attendanceByDate: [],
        };
      }
      groupedData[monthName].attendanceByDate.push(record);
    })
  });
  return Object.values(groupedData);
};

const restartZkDevice = async (req, res) => {
  try {
    await zkInstance1.restart((err, response) => {
      if (err) {
        console.error("Failed to restart device:", err);
        zkInstance1.disconnect();
        return;
      }

      console.log("Device restarted successfully");
      zkInstance1.disconnect();
    });
    res.status(200).json({ message: "Device Has been restarted" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  zkAttendanceUSerRecord,
  getzkAttendanceUSerRecord,
  getUserMonthlyReport,
  restartZkDevice,
  groupAttendanceRecordsByMonth
};
