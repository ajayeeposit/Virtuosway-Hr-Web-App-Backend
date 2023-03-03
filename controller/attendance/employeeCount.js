const {
  ZkUserRecord,
  OldOfficeSchema,
  NewOfficeSchema,
} = require("../../model/Attendance/zkAttendance");
const Employee = require("../../model/Employee/Employee");

const officeDataCount = async (req, res) => {
  const oldOffice = [10, 121, 122, 123, 124, 126, 127, 128, 130, 200, 201];
  try {
    const { startDate, endDate } = req.query;
    const attendanceData = await ZkUserRecord.aggregate([
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
                  { $eq: ["$$record.absent", false] },
                  { $eq: ["$$record.holiday", false] },
                ],
              },
            },
          },
        },
      },
      { $unwind: "$attendanceByDate" },
    ]).exec();

    const oldOfficeData = attendanceData.filter((users) =>
      oldOffice.includes(users.userSn)
    );
    console.log(oldOfficeData);
    const newOfficeData = attendanceData.filter(
      (users) => !oldOffice.includes(users.userSn)
    );
    // await OldOfficeSchema.updateMany(oldOfficeData);
    // await NewOfficeSchema.insertMany(newOfficeData);
    res.status(200).json({
      newOffice: {newOfficeData, presentUser: newOfficeData.length },
      oldOffice: { oldOfficeData, presentUser: oldOfficeData.length },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { officeDataCount };
