const Employee = require("../../model/Employee/Employee");
const { ZkUserRecord } = require("../../model/Attendance/zkAttendance");

//update Employee record by adding attendance id
const updateEmployeeAttendance = async (req, res) => {
  try {
    const employees = await Employee.find();
    const employeeNumbers = employees.map(
      (employee) => employee.employeeNumber
    );

    const attendanceByEmployee = await Promise.all(
      employeeNumbers.map(async (employeeNumber) => {
        const userSn = employeeNumber;
        const attendanceRecords = await ZkUserRecord.find({ userSn });

        const attendanceData = attendanceRecords.map((record) => record._id);

        // Update employee record with attendance record ids
        const employee = await Employee.findOneAndUpdate(
          { employeeNumber },
          { $set: { attendanceRecords } },
          { new: true }
        );
        return {
          employeeNumber,
          employee: employees.find(
            (employee) => employee.employeeNumber === employeeNumber
          ),
        };
      })
    );

    res.status(200).json(attendanceByEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//populating employee attendanceRecord into employee data
const getEmployeeRecordWithAttendance = async (req, res) => {
  try {
    const employees = await Employee.find().populate("attendanceRecords").sort({ employeeName: 1 });
    console;
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//get totalworkhour of employeee
const getTotalWorkHourofEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "attendanceRecords"
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const totalWorkHour = employee.attendanceRecords
      .reduce((acc, attendanceRecord) => {
        return (
          acc +
          attendanceRecord.attendanceByDate.reduce((acc, attendanceByDate) => {
            if (!attendanceByDate.absent && !attendanceByDate.holiday) {
              return acc + parseFloat(attendanceByDate.workHour);
            }
            return acc;
          }, 0)
        );
      }, 0)
      .toFixed(2);
    res.status(200).json({
      _id: employee._id,
      Name: employee.employeeName,
      userSn: employee.employeeNumber,
      totalWorkHour,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get single employee attendance with record
const getSingleEmployeeRecordWithAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id)
      .populate("attendanceRecords")
      .sort({ employeeName: 1 });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//get attendance of user by date
const getAttendanceByDate = async (req, res) => {
  try {
    const { userSn, date } = req.query;
    const result = await ZkUserRecord.aggregate([
      { $match: { userSn: parseInt(userSn) } },
      {
        $project: {
          attendanceByDate: {
            $filter: {
              input: "$attendanceByDate",
              as: "record",
              cond: { $eq: ["$$record.date", date] },
            },
          },
        },
      },
      { $unwind: "$attendanceByDate" },
    ]).exec();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//get attendance of user from date range
const getAttendanceByDateRange = async (req, res) => {
  try {
    const { userSn, startDate, endDate } = req.query;
    const userDetails = await Employee.find({ employeeNumber: userSn });
    const result = await ZkUserRecord.aggregate([
      { $match: { userSn: parseInt(userSn) } },
      {
        $project: {
          attendanceByDate: {
            $filter: {
              input: "$attendanceByDate",
              as: "record",
              cond: {
                $and: [
                  { $gte: ["$$record.date", startDate] },
                  { $lte: ["$$record.date", endDate] },
                ],
              },
            },
          },
        },
      },
      { $unwind: "$attendanceByDate" },
    ]).exec();
    const employeeName = userDetails[0].employeeName;
    res.status(200).json({ employeeName, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//get all user record from date range
const getAllUserAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await ZkUserRecord.aggregate([
      {
        $project: {
          attendanceByDate: {
            $filter: {
              input: "$attendanceByDate",
              as: "record",
              cond: {
                $and: [
                  { $gte: ["$$record.date", startDate] },
                  { $lte: ["$$record.date", endDate] },
                  { $eq: ["$$record.absent", true] },
                  { $eq: ["$$record.holiday", false] },
                ],
              },
            },
          },
        },
      },
      { $unwind: "$attendanceByDate" },
    ]).exec();
    // console.log("result", result);

    // const absent = result.filter((att) => {
    //   return att.attendanceByDate.absent === true;

    // })

    res.status(200).json({ ...result, userName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//get attendance of user by month
const getAttendanceByMonth = async (req, res) => {
  try {
    const userSn = 3;
    const year = 2023;
    const month = 1;

    const result = await ZkUserRecord.aggregate([
      { $match: { userSn: userSn } },
      {
        $project: {
          attendanceByDate: {
            $filter: {
              input: "$attendanceByDate",
              as: "attendance",
              cond: {
                $and: [
                  {
                    $eq: [
                      {
                        $year: {
                          $dateFromString: {
                            dateString: "$$attendance.date",
                          },
                        },
                      },
                      year,
                    ],
                  },
                  {
                    $eq: [
                      {
                        $month: {
                          $dateFromString: {
                            dateString: "$$attendance.date",
                          },
                        },
                      },
                      month,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    ]).exec();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateEmployeeAttendance,
  getEmployeeRecordWithAttendance,
  getTotalWorkHourofEmployee,
  getAttendanceByDate,
  getAttendanceByDateRange,
  getAllUserAttendanceByDateRange,
  getAttendanceByMonth,
  getSingleEmployeeRecordWithAttendance,
};
