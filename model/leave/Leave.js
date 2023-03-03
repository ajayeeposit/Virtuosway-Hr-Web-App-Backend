const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSchema = new Schema(
    {
        empId: {
            type: String,
            required: true,
        },
        leaveType: {
            type: String,
            required: true,
        },
        Date: {
            From: {
                type: Date,
            },
            To: {
                type: Date,
            }
        },
        teamEmail: {
            type: String,

        },
        reasonOfLeave: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const leaveModel = mongoose.model("leaveModel", leaveSchema);
module.exports = leaveModel;
