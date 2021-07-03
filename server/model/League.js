const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PickHistoryModelSchema = new Schema({
    year: { type: String, required: true },
    week: { type: String, required: true },
    picks: [
        {
            game_id: { type: Schema.Types.ObjectId, ref: "Schedule" },
            players: [
                {
                    player_id: { type: Schema.Types.ObjectId, ref: "Player", required: true },
                    picked: { type: Boolean, required: true },
                    picked_home: { type: Boolean, required: true },
                    correct: { type: Boolean, required: true },
                    confidence_points: { type: Number, required: true, default: 0 },
                    is_tiebreaker: { type: Boolean, required: true },
                    tiebreaker: { type: Number, required: true }
                }
            ]
        }
    ]
});

const StandingsModelSchema = new Schema({
    player_id: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    points: { type: Number, required: true },
    credits: { type: Number, required: true },
    correct: { type: Number, required: true },
    wrong: { type: Number, required: true }
})

const LeagueModelSchema = new Schema({
    league_id: { type: String, unique: true, required: true },
    signup_key: { type: String, unique: true, required: true },
    display_name: { type: String, required:  true },
    type: { type: String, required:  true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    players: [{ type: Schema.Types.ObjectId, ref: "Player", required: true }],
    banned_players: [{ type: Schema.Types.ObjectId, ref: "User" }],
    standings: [{ type: StandingsModelSchema, required: false}],
    pick_history: [{ type: PickHistoryModelSchema, required: false}]
});

const League = mongoose.model("League", LeagueModelSchema, "League")

module.exports = League;