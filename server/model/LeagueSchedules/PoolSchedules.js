const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PickModelSchema = new Schema({
    player_id: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    picked: { type: Boolean, required: true },
    picked_home: { type: Boolean, required: true },
    correct: { type: Boolean, required: true },
    confidence_points: { type: Number, required: true, default: 0 },
    is_tiebreaker: { type: Boolean, required: true },
    tiebreaker: { type: Number, required: true }
})

const EventModelSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
    play: { type: Boolean, required: true },
    is_tiebreaker: { type: Boolean, required: true },
    picks: [{ type: PickModelSchema, required: true }]           
})

const ScheduleModelSchema = new Schema({
    league: { type: Schema.Types.ObjectId, ref: "League", required: true },
    year: { type: String, required: true },
    week: { type: String, required: true },
    events: [{ type: EventModelSchema, required: true }]
});

const PoolSchedules = mongoose.model("PoolSchedules", ScheduleModelSchema, "PoolSchedules")

module.exports = PoolSchedules;