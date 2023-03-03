const express = require("express");
const {createJob,
    getJobs,
    getJobById,
    deleteJob,
    updateJob,
    searchJobs}= require('../../controller/jobs/jobController');
const router = express.Router();

router.post("/createJob", createJob);
router.get("/getJobs", getJobs);
router.get("/getJob/:id", getJobById);
router.get("/getJobs/:title", searchJobs);
router.put("/updateJob/:id", updateJob);
router.delete("/deleteJob/:id", deleteJob);

module.exports = router;
