const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const GameConfigModelSchema = new Schema({
    game_id: { type: String, required: true, unique: true },
    display_name: { type: String, required: true },
    tiers: { any: Object, required: true }
});

const GameConfig = mongoose.model("GameConfig", GameConfigModelSchema, "GameConfig")

module.exports = GameConfig;