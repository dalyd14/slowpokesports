const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TeamModelSchema = new Schema({
    espn_id: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    name: { type: String, required: false },
    nickname: { type: String, required: true },
    abbreviation: { type: String, required: true },
    displayName: { type: String, required: true },
    shortDisplayName: { type: String, required: true },
    color: { type: String, required: true },
    alternateColor: { type: String, required: false },
    logo: { type: String, required: true }
});

const Team = mongoose.model("Team", TeamModelSchema, "Team")

module.exports = Team;