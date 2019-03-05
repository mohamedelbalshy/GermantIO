const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const StatusSchema = new Schema({
    statusOfEmployee:{
        type: String
        
    }
});



module.exports = mongoose.model('Status', StatusSchema);