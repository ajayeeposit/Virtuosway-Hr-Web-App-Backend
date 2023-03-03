const Employee = require("../../model/Employee/Employee");
const { ZkUserRecord } = require("../../model/Attendance/zkAttendance");
const cron = require("node-cron");
const dotenv = require("dotenv");
const { WebClient } = require("@slack/web-api");
const { format, parse } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");
const NepaliDate = require("nepali-date-converter");
dotenv.config({ path: "./config.env" });

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

//lookup for SlackID using user email
const lookupUserByEmail = async (email) => {
  try {
    const response = await slackClient.users.lookupByEmail({
      email: "aranabhat@eeposit.com",
    });

    return response.user.id;
  } catch (error) {
    console.error(`Error looking up user by email: ${error}`);
    return null;
  }
};

//notify employee if late

const notifyEmployeesMorning = async () => {
  try {

    const nepaliDate = new NepaliDate(new Date());
    const year = nepaliDate.getYear();
    const month = (nepaliDate.getMonth() + 1).toString().padStart(2, "0");
    const day = nepaliDate.getDate().toString().padStart(2, "0");
    const currentDate = `${year}/${month}/${day}`;
    const employees = await Employee.find({}).exec();

    await Promise.all(
      employees.map(async (employee) => {
        const { employeeNumber, email, employeeName } = employee;
        const slackUserId = await lookupUserByEmail(email);

        if (slackUserId) {
          const attendance = await ZkUserRecord.findOne({
            userSn: employeeNumber,
          }).exec();

          if (attendance) {
            const attendanceByDate = attendance.attendanceByDate;
            const lastAttendance = attendanceByDate[attendanceByDate.length - 1];
            const nepalTimezone = "Asia/Kathmandu";

            //how to get attendance time from ZkUserRecord
            const dateObjectentry = parse(
              lastAttendance.entryTime,
              "h:mm a",
              new Date()
            );
            const entryTimeAttendance = new Date(dateObjectentry);
            const lateTime = utcToZonedTime(new Date(), nepalTimezone);
            lateTime.setHours(9, 5, 0); // Set to 9:15 am
            const lateByMs = Math.max(entryTimeAttendance - lateTime, 0);
            const lateByMinutes = Math.round(lateByMs / (1000 * 60));

            if (lastAttendance.date == currentDate) {
              let message = "";
              if (lateByMinutes > 0) {
                message = ` Hello ${employeeName}, you're late by ${lateByMinutes} minutes. Please be on Time. Thank you.`;
              }
              if (message !== "") {
                try {
                  const response = await slackClient.chat.postMessage({
                    channel: slackUserId,
                    text: message,
                  });

                  console.log(
                    `Message sent to ${employeeName}: ${response.ts}:${response.message}`
                  );
                } catch (error) {
                  console.error(
                    `Error sending message to ${employeeName}: ${error}`
                  );
                }
              }
            }
          } else {
            console.log(`No attendance data found for ${employeeName}`);
          }
        } else {
          console.log(`No Slack user found for ${employeeName}`);
        }
      })
    );
   
  }
  catch (error) {
    console.log(error)
    
  }
};

//notify employee if early
const notifyEmployeesEvening = async () => {
  try {

    const nepaliDate = new NepaliDate(new Date());
    const year = nepaliDate.getYear();
    const month = (nepaliDate.getMonth() + 1).toString().padStart(2, "0");
    const day = nepaliDate.getDate().toString().padStart(2, "0");
    const currentDate = `${year}/${month}/${day}`;
    const employees = await Employee.find({}).exec();

    await Promise.all(
      employees.map(async (employee) => {
        const { employeeNumber, email, employeeName } = employee;
        const slackUserId = await lookupUserByEmail(email);

        if (slackUserId) {
          const attendance = await ZkUserRecord.findOne({
            userSn: employeeNumber,
          }).exec();

          if (attendance) {
            const attendanceByDate = attendance.attendanceByDate;
            const lastAttendance = attendanceByDate[attendanceByDate.length - 1];
            const nepalTimezone = "Asia/Kathmandu";

            //how to get attendance time from ZkUserRecord
            const dateObjectexit = parse(
              lastAttendance.exitTime,
              "h:mm a",
              new Date()
            );
            const exitTimeAttendance = new Date(dateObjectexit);
            const earlyTime = utcToZonedTime(new Date(), nepalTimezone);
            earlyTime.setHours(18, 0, 0, 0); // Set to 6:00 pm
            const leftEarlyMs = Math.max(earlyTime - exitTimeAttendance, 0);
            const leftEarlyMinutes = Math.round(leftEarlyMs / (1000 * 60));

            if (lastAttendance.date == currentDate) {
              let message = "";
              if (leftEarlyMinutes > 0) {
                message = `Hello ${employeeName}, you left ${leftEarlyMinutes} minutes early. Please leave on Time. Thank you.`;
              }
              if (message !== "") {
                try {
                  const response = await slackClient.chat.postMessage({
                    channel: slackUserId,
                    text: message,
                  });

                  console.log(`Message sent to ${employeeName}: ${response.ts}`);
                } catch (error) {
                  console.error(
                    `Error sending message to ${employeeName}: ${error}`
                  );
                }
              }
            }
          } else {
            console.log(`No attendance data found for ${employeeName}`);
          }
        } else {
          console.log(`No Slack user found for ${employeeName}`);
        }
      })
    );
     res.status(200).json({ message: "User Notified Successfully" })
  }
  catch (err) {
    console.log(err)
        res.status(500).json({ message: "Something went wrong" })
  }
};


module.exports = {
  notifyEmployeesMorning,
  notifyEmployeesEvening,
};
