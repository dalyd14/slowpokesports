const mongoose = require('mongoose')
// const mongoose = require('../config/connection')
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

//This is creating our user model
const UserModelSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        permission: { type: String, required: true, enum: ['effikas', 'owner', 'admin', 'employee'] },
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true }
    }
);

UserModelSchema.pre('save', function(next) {
    let user = this;

    if(!user.isModified('password')) return next()

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
})

UserModelSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', UserModelSchema, "User")

module.exports = User;