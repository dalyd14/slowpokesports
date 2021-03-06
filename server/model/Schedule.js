const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ScheduleModelSchema = new Schema({
    espn_game_id: { type: String, unique: true, required: true },
    league_type: { type: String, required: true, enum: ['nfl', 'ncaa_fbs'] },
    home_team: { type: Schema.Types.Mixed, ref: "Team" },
    home_rank: { type: Number, required: true, default: 0 },
    away_team: { type: Schema.Types.Mixed, ref: "Team" },
    away_rank: { type: Number, required: true, default: 0 },
    start_time: { type: Date, required: false },
    season: { type: String, required: true },
    week: { type: String, required: true },
    seasonType: { type: String, required: true },
    completed: { type: Boolean, required: true },
    odds: { 
        line: { type: Number },
        favorite: { type: String }
    },
    home_score: { type: Number, required: true },
    away_score: { type: Number, required: true },
    display_name: { type: String, required: true }
});

const Schedule = mongoose.model("Schedule", ScheduleModelSchema, "Schedule")

module.exports = Schedule;

// home_team: { type: Schema.Types.ObjectId, ref: "Team" },
// away_team: { type: Schema.Types.ObjectId, ref: "Team" },