const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PoolStandingsModelSchema = new Schema({
    league: { type: Schema.Types.ObjectId, ref: "League", required: true },
    year: { type: String, required: true },
    player_id: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    points: { type: Number, required: true },
    credits: { type: Number, required: true },
    correct: { type: Number, required: true },
    wrong: { type: Number, required: true }
})

const PoolStandings = mongoose.model("PoolStandings", PoolStandingsModelSchema, "PoolStandings")

module.exports = PoolStandings;