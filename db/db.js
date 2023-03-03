const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const DB = process.env.DB;
mongoose
  .connect(DB)
  .then(() => {
    console.log("Database connection Successful");
  })
  .catch((err) => {
    console.log("No Connection", err);
  });


