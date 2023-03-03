const shiftModel = require('../../model/shift/shift')

const createShift = async (req, res) => {
    const { workingDay, shiftSchedule, device, shiftName, Date, Reason } = req.body;
    try {
        const shift = new shiftModel({
            workingDay,
            shiftName,
            shiftSchedule,
            device,
            Date,
            Reason
        })
        await shift.save();
        res.status(201).json({ message: "Shift Created Successfully", shift })
    } catch (e) {
        res.status(400).json({ message: "Something went wrong" })
    }
}
const getShiftData = async (req, res) => {
    try {
        const shift = await shiftModel.find({}).sort({ createdAt: -1 });
        const Count = await shiftModel.countDocuments({});
        res.status(200).json({ message: "Shift Data Fetched Successfully", shift, Count })
    } catch (e) {
        res.status(400).json({ message: "Something went wrong", e })
    }
}

module.exports = { createShift, getShiftData };
