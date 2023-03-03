const express = require("express");
const { createLeaveData, getLeaveData,deleteLeaveData } = require('../../controller/leave/leaveController')
const router = express.Router();

router.post("/createLeaveData", createLeaveData);
router.get("/getLeaveData", getLeaveData);
router.delete("/deleteLeaveData/:id", deleteLeaveData);


module.exports = router;
