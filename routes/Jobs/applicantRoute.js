const express = require("express");
const {createApplicant,getApllicant,getApllicantById,searchApplicant,deleteApplicant}= require('../../controller/jobs/applicantController')
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/resume');
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}.pdf`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype)
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only PDF is allowed!"), false);
    }
  },

});

router.post("/createApplicant",upload.single('resume'), createApplicant);
router.get("/getApllicant", getApllicant);
router.delete("/deleteApplicant/:id", deleteApplicant);
router.get("/getApllicantById/:id", getApllicantById);
router.get("/searchApplicant/:firstName", searchApplicant);

module.exports = router;
