const express = require("express");
const app = express();
const jobRoute = require("./routes/Jobs/jobRoute");
const userRoute = require("./routes/Jobs/userRoute");
const applicantRoute = require("./routes/Jobs/applicantRoute");
const leaveRoute = require("./routes/leave/leaveRoute");
const shiftRoute = require("./routes/shift/shiftRoute");
const testZkTeco = require("./routes/Attendance/zkRoute");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const employeeRoute = require("./routes/Employee");
dotenv.config({ path: "./config.env" });
require("./db/db");
app.use("/public", express.static("public"));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

app.use("/api", jobRoute);
app.use("/api", userRoute);
app.use("/api", applicantRoute);
app.use("/api", testZkTeco);
app.use("/api", leaveRoute);
app.use("/api", shiftRoute);
app.use("/api/employee", employeeRoute);

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server Started...");
});

app.listen(port, () => {
  console.log("Server Started");
});
