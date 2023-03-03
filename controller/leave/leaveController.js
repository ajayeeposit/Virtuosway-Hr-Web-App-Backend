const leaveModel = require('../../model/leave/Leave')

const createLeaveData = async (req, res) => {
    const { empId, leaveType, Date, teamEmail, reasonOfLeave } = req.body;

    try {
        const leave = new leaveModel({
            empId,
            leaveType,
            Date,
            teamEmail,
            reasonOfLeave
        })
        await leave.save();
        res.status(201).json({ message: "Leave Created Successfully", leave })
    } catch (e) {
        res.status(400).json({ message: "Something went wrong" })
    }

}

const getLeaveData = async (req, res) => {
    try {
        const leave = await leaveModel.find({}).sort({ createdAt: -1 });
        const Count = await leaveModel.countDocuments({});
        res.status(200).json({ message: "Leave Data Fetched Successfully", leave, Count })
    } catch (e) {
        res.status(400).json({ message: "Something went wrong", e })
    }
}

const deleteLeaveData = async (req, res) => {
    const { id } = req.params;
    try {
        const leave = await leaveModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Leave Deleted Succesfully', leave });
    } catch (e) {
        res.status(400).json({ message: 'Something Went Wrong', e });
    }
}

module.exports = { createLeaveData, getLeaveData, deleteLeaveData };
