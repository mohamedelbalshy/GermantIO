const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        minLength: 2
    },
    email: {
        type: String, 
        unique: true, 
        lowercase: true 
    },
    mobileNo:{
        type: String,
        trim: true
    },
    hireDate:{
        type: Date,
        default: Date.now
    },
    daysCounter:{
        type: Number,
        default: 0
    },
    sumOfHours: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);