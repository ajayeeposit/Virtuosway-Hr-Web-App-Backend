const express = require("express");
const {registerUser,loginUser,getUsers,deleteUser}= require('../../controller/jobs/adminController')
const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.get("/getUsers", getUsers);
router.delete("/deleteUser/:id", deleteUser);

module.exports = router;
