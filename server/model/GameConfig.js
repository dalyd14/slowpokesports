const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TierModelSchema = new Schema({
    price: { type: Number, required: true },
    player_size_limit: { type: Number, required: true },
    nfl: { type: Boolean, required: true },
    ncaafb: { type: Boolean, required: true },
    ncaafb_week_limit: { type: Number, required: true },
})

const GameConfigModelSchema = new Schema({
    game_id: { type: String, required: true, unique: true },
    display_name: { type: String, required: true },
    bench_plan: { type: TierModelSchema },
    pro_plan: { type: TierModelSchema },
    hof_plan: { type: TierModelSchema }
});

const GameConfig = mongoose.model("GameConfig", GameConfigModelSchema, "GameConfig")

module.exports = GameConfig;