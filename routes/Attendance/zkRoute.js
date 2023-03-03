const {
    zkAttendanceUSerRecord,
    getzkAttendanceUSerRecord,
    getUserMonthlyReport,
    restartZkDevice,
} = require("../../controller/attendance/zktecoMainController");
const {
    notifyEmployeesMorning,
    notifyEmployeesEvening,
} = require("../../controller/attendance/notifyEmployee");
const {
    updateEmployeeAttendance,
    getEmployeeRecordWithAttendance,
    getAttendanceByDate,
    getAttendanceByDateRange,
    getAllUserAttendanceByDateRange,
    getAttendanceByMonth,
    getSingleEmployeeRecordWithAttendance,
    getTotalWorkHourofEmployee,
} = require("../../controller/attendance/employeeAttendance");
const {
    officeDataCount,
} = require("../../controller/attendance/employeeCount");
const express = require("express");
const router = express.Router();

//Main route
router.put("/updatezkAttendanceRecord", zkAttendanceUSerRecord);
router.get("/getzkAttendanceUSerRecord", getzkAttendanceUSerRecord);
router.get("/getUserMonthlyReport", getUserMonthlyReport);
router.put("/updateEmployeeAttendance", updateEmployeeAttendance);
router.get("/getEmployeeRecordWithAttendance", getEmployeeRecordWithAttendance);
router.get(
    "/getSingleEmployeeRecordWithAttendance/:id",
    getSingleEmployeeRecordWithAttendance
);
router.get("/getAttendanceByDate", getAttendanceByDate);
router.get("/getAttendanceByDateRange", getAttendanceByDateRange);
router.get("/getAllUserAttendanceByDateRange", getAllUserAttendanceByDateRange);
router.get("/getAttendanceByMonth", getAttendanceByMonth);
router.get("/getTotalWorkHourofEmployee/:id", getTotalWorkHourofEmployee);

//Slack Notify Route
router.get("/notifyEmployeesMorning", notifyEmployeesMorning);
router.get("/notifyEmployeesEvening", notifyEmployeesEvening);
router.get("/restartZkDevice", restartZkDevice);

//Office User Data count
router.get("/getofficeDataCount", officeDataCount);
module.exports = router;
