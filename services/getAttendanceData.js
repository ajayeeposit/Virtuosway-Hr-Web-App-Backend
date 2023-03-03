const NepaliDate = require("nepali-date-converter");
const moment = require('moment');

const getAttendanceData = async (zkInstance1, zkInstance2, ZkUserRecord) => {
  try {
    try {
      await zkInstance1.createSocket();
    } catch (e) {
      console.log("error in getting logs from device 1", e);
    }
    try {
      await zkInstance2.createSocket();
    } catch (e) {
      console.log("error in getting logs from device 2", e);
    }
    const logs1 = await zkInstance1.getAttendances();
    const logs2 = await zkInstance2.getAttendances();
    const logs = [...logs1.data, ...logs2.data];
    const results = await logs.reduce((acc, record) => {
      const nepaliDate = new NepaliDate(new Date(record.recordTime));
      const year = nepaliDate.getYear();
      const month = (nepaliDate.getMonth() + 1).toString().padStart(2, "0");
      const day = nepaliDate.getDate().toString().padStart(2, "0");
      const formattedDate = `${year}/${month}/${day}`;
      const userSn = record.deviceUserId;
      if (!acc[userSn]) {
        acc[userSn] = {};
      }
      if (!acc[userSn][formattedDate]) {
        acc[userSn][formattedDate] = [];
      }
      acc[userSn][formattedDate].push(record);
      return acc;
    }, {});

    //manipulating the above data to get date,entryTime,exitTime and workHour
    const attendanceByUser = Object.entries(results).map(
      ([userSn, attendanceByDate]) => {
        const attendanceByDateArray = [];
        const dates = Object.keys(attendanceByDate);

        const startDate = new NepaliDate(
          Math.min(...dates.map((d) => new NepaliDate(d).toJsDate().getTime()))
        );
        const endDate = new NepaliDate(
          Math.max(...dates.map((d) => new NepaliDate(d).toJsDate().getTime()))
        );
        let currentDate = startDate;

        while (currentDate <= endDate) {
          const year = currentDate.getYear();
          const month = (currentDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const day = currentDate.getDate().toString().padStart(2, "0");
          const date = `${year}/${month}/${day}`

          const weekday = currentDate.getDay();

          if (weekday === 0 || weekday === 6 || date === "2079/11/22") {
            // if it's a Saturday or Sunday
            attendanceByDateArray.push({
              date,
              entryTime: "",
              exitTime: "",
              workHour: "",
              moringStatus: "",
              eveningStatus: "",
              holiday: true,
              absent: false,
            });
          } else if (attendanceByDate[date]) {
            const attendance = attendanceByDate[date];
            const entryTime = new Date(
              Math.min(
                ...attendance.map((record) => new Date(record.recordTime))
              )
            );
            const exitTime = new Date(
              Math.max(
                ...attendance.map((record) => new Date(record.recordTime))
              )
            );
            const workHour = (exitTime - entryTime) / 3600000;
            const entry = moment(entryTime, "HH:mm").format('HH:mm A');
            const exit = moment(exitTime, "HH:mm").format('HH:mm A');
            const morning = moment('09:00', 'HH:mm');
            const evening = moment('18:00', 'HH:mm');

            attendanceByDateArray.push({
              date,
              entryTime: entry,
              exitTime: (entry === exit ? "-" : exit),
              workHour: parseFloat(workHour).toFixed(2),
              moringStatus: (moment(entry, 'HH:mm').isBefore(morning)) ? "Timely In" : "Late In",
              eveningStatus: (moment(exit, 'HH:mm').isBefore(evening)) ? "Early Out" : "Timely Out",
              holiday: false,
              absent: false,
            });
          } else {
            attendanceByDateArray.push({
              date,
              entryTime: "",
              exitTime: "",
              workHour: "",
              moringStatus: "",
              eveningStatus: "",
              absent: true,
              holiday: false,
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
          userSn,
          attendanceByDate: attendanceByDateArray,
        };
      }
    );

    await Promise.all(
      attendanceByUser.map(async (userAttendance) => {
        const existingAttendance = await ZkUserRecord.findOne({
          userSn: userAttendance.userSn,
        }).exec();
        if (existingAttendance) {
          // Update existing document
          const existingAttendanceByDate = existingAttendance.attendanceByDate;
          const newAttendanceByDate = userAttendance.attendanceByDate;
          for (const [index, entry] of newAttendanceByDate.entries()) {
            const existingEntry = existingAttendanceByDate.find(
              (e) => e.date === entry.date
            );
            if (existingEntry) {
              // Update existing entry
              existingEntry.entryTime = entry.entryTime;
              existingEntry.exitTime = entry.exitTime;
              existingEntry.workHour = entry.workHour;
            } else {
              // Add new entry
              existingAttendanceByDate.push(entry);
            }
          }
          existingAttendance.markModified("attendanceByDate");
          await existingAttendance.save();
        } else {
          // Create new document
          await ZkUserRecord.create({
            userSn: userAttendance.userSn,
            attendanceByDate: userAttendance.attendanceByDate,
          });
        }
      })
    );
    await zkInstance1.disconnect()
    await zkInstance2.disconnect()
    return attendanceByUser;
  } catch (e) {
    return { message: "Something went wrong", e, status: 500 };
  }
};

module.exports = { getAttendanceData };
