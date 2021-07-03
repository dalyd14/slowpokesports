const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

//League settings for a User
const UserLeagueModelSchema = new Schema(
    {
        league_id: { type: Schema.Types.ObjectId, ref: "League" },
        player_name: { type: String, required: true },
        collaborative: { type: Boolean, required: true },
        owner: { type: Boolean, required: true }
    }
);

//This is creating our user model
const UserModelSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        leagues: [{ type: UserLeagueModelSchema, required: false}]
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