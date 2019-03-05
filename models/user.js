const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    name: String,
    password: {
        type: String,
        required: true,
        minLength: 2   

    },
    
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    if (user.password) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next(err);
            });
        });
    }
});


UserSchema.methods.comparePassword = function (password) {

    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);
