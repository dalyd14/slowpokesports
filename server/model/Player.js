const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PlayerModelSchema = new Schema({
    display_name: { type: String, required: true },
    users_id: [{ type: Schema.Types.ObjectId, ref: "User" }],
    league_id: { type: Schema.Types.ObjectId, ref: "League", unique: true, required: true },
});

const Player = mongoose.model("Player", PlayerModelSchema, "Player")

module.exports = Player;