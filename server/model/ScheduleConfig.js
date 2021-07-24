const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ScheduleConfigModelSchema = new Schema({
    league: { type: String, unique: true, required: true },
    current_season: { type: Number, required: true },
    current_season_type: { type: Number, required: true },
    current_week: { type: Number, required: true }
});

const ScheduleConfig = mongoose.model("ScheduleConfig", ScheduleConfigModelSchema, "ScheduleConfig")

module.exports = ScheduleConfig;