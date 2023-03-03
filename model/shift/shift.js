const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shiftSchema = new Schema(
    {

        shiftName: {
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
        workingDay: {
            type: String,

        },
        shiftSchedule: {
            type: String
        },
        device: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const shiftModel = mongoose.model("shiftModel", shiftSchema);
module.exports = shiftModel;
