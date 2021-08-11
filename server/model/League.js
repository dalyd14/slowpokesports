const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const LeagueModelSchema = new Schema({
    league_id: { type: String, unique: true, required: true },
    inviteToken: { type: String, unique: true },
    display_name: { type: String, required:  true },
    type: { type: String, required:  true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
    open_league: { type: Boolean, required: true },
    settings: { type: Schema.Types.ObjectId, ref: "PoolSettings" },
    standings: [{ type: Schema.Types.ObjectId, ref: "PoolStandings", required: false }]
});

const League = mongoose.model("League", LeagueModelSchema, "League")

module.exports = League;