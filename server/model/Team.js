const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TeamModelSchema = new Schema({
    team_id: { type: String, required: true },
    location: { type: String, required: true },
    name: { type: String, required: true },
    nickname: { type: String, required: true },
    abbreviation: { type: String, required: true },
    displayName: { type: String, required: true },
    shortDisplayName: { type: String, required: true },
    color: { type: String, required: true },
    alternateColor: { type: String, required: true },
    logo: { type: String, required: true }
});

const Team = mongoose.model("Team", TeamModelSchema, "Team")

module.exports = Team;