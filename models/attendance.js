const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);


const AttendanceSchema = new Schema({
    day:{
        type: Date,
        default: Date.now
    },
    workingHours: {
        type: Number
    },
    employee: {
        type: Schema.Types.ObjectId, ref:'Employee'
    },
    status: {
        type: Schema.Types.ObjectId, ref: 'Status'
    }
});

AttendanceSchema.plugin(deepPopulate);

module.exports = mongoose.model('Attendance', AttendanceSchema);