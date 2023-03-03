const express = require("express");
const { createShift, getShiftData } = require('../../controller/shift/shiftController')
const router = express.Router();

router.post("/createShift", createShift);
router.get("/getShiftData", getShiftData);


module.exports = router;
