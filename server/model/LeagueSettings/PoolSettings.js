const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PoolSettingsModelSchema = new Schema({
    leagueSizeLimit: { type: Number, required: true },
    ncaafbIncluded: { type: Boolean, required: true },
    ncaafbWeekGameLimit: { type: Number, required: true },
    planTier: { type: String, required: true },
    weekStart: { type: Number, required: true },
    weekEnd: { type: Number, required: true },
    confidencePoints: {
        high: {
            points: { type: Number, required: true },
            quantity: { type: Number, required: true }
        },
        low: {
            points: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    }
})

const PoolSettings = mongoose.model("PoolSettings", PoolSettingsModelSchema, "PoolSettings")

module.exports = PoolSettings;