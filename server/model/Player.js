const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PlayerModelSchema = new Schema({
    display_name: { type: String, required: true },
    owner: { type: Boolean, required: true },
    playerOwner: { type: Schema.Types.ObjectId, ref: "User" },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    collaborative: { type: Boolean, required: true },
    league: { type: Schema.Types.ObjectId, ref: "League", required: true },
    inviteToken: { type: String, unique: true }
});

const Player = mongoose.model("Player", PlayerModelSchema, "Player")

module.exports = Player;