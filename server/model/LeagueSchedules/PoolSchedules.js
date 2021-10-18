const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PickModelSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
    play: { type: Boolean, required: true },
    is_tiebreaker: { type: Boolean, required: true },
    odds: { 
        line: { type: Number },
        favorite: { type: String }
    },
    picked: { type: Boolean, required: true },
    picked_home: { type: Boolean, required: true },
    correct: { type: Boolean, required: true },
    confidence_points: { type: Number, required: true, default: 0 },
    tiebreaker: { type: Number, required: false }
})

const ScheduleModelSchema = new Schema({
    player_id: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    league: { type: Schema.Types.ObjectId, ref: "League", required: true },
    year: { type: String, required: true },
    week: { type: String, required: true },
    finished: { type: Boolean, required: true },
    closed: { type: Boolean, required: true },
    closed_at: { type: Date, required: false },
    events: [{ type: PickModelSchema, required: true }]
});

const PoolSchedules = mongoose.model("PoolSchedules", ScheduleModelSchema, "PoolSchedules")

module.exports = PoolSchedules;