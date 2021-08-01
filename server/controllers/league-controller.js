const { League, Player, User } = require('../model')

const leagueController = {
    async getAllLeagues (req, res) {
        const foundLeagues = await League.find()
        res.json(foundLeagues)
    },

    async getOneLeague ({ params }, res) {
        const foundLeague = await League.find({ league_id: params.league_id })
            .populate(
                {
                    path: 'players',			
                    populate: { 
                        path:  'league'
                    }
                }
            )
        res.json(foundLeague)
    },

    async createNewLeague (req, res) {
        try {
            const { body } = req
            const newLeague = await League.create({
                league_id: body.league.league_id,
                signup_key: body.league.signup_key,
                display_name: body.league.display_name,
                type: body.league.type,
                owner: req.user._id,
                users: [req.user._id],
                players: [],
                banned_players: [],
                settings: body.league.settings,
                standings: [],
                pick_history: []
            })

            const newPlayer = await Player.create({
                display_name: body.player.display_name,
                owner: true,
                playerOwner: req.user._id,
                users: [req.user._id],
                collaborative: body.player.collaborative,
                league: newLeague._id
            })

            await League.findByIdAndUpdate(newLeague._id, 
                { $push: { players: newPlayer._id } }
            )

            await User.findByIdAndUpdate(req.user._id, 
                { $push: { players: newPlayer._id } }
            )

            res.json({league: newLeague, player: newPlayer})            
        } catch (e) {
            res.status(400).json({ message: 'An error occurred while the league was being created', ...e })
        }
    },

    async deleteLeague ({ params, user }, res) {

        try {
            const foundLeague = await League.findOne({ league_id: params.league_id }).select("_id owner players")

            if (!foundLeague) {
                throw { error_message :'This league could not be found!' }
            }
            else if (foundLeague.owner != user._id) {
                console.log(foundLeague.owner, user._id)
                throw { error_message :'You do not have the proper permissions to perform this operation.' }
            } 
            else if (foundLeague.owner == user._id) {
                
                // Delete the league
                const deletedLeague = await League.deleteOne({ _id: foundLeague._id })

                if (!deletedLeague.ok) {
                    throw { error_message: "An error occurred while deleting the league." }
                }

                // Delete all players associated with the league
                const deletedPlayers = await Player.deleteMany({ league: foundLeague._id })

                if (!deletedPlayers.ok) {
                    throw { error_message: "An error occurred while deleting the players of the league." }
                }

                // Delete all players for the users
                Promise.all(foundLeague.players.map(player => {
                    return User.findOneAndUpdate({ players: player }, 
                    { $pull: { players: player } })
                }))
                .then(result => {
                    res.status(400).json({ success: 'League successfully deleted' })
                })
                .catch(e => {
                    res.status(400).json({ error: 'An error occured while deleting this league.' })
                })

            } else {
                throw { error_message :'Unknown error occurred while deleting league' }
            }
        } catch (e) {
            res.status(400).json({ message: "An error occurred while deleting the league.", ...e })
        }
    }
}

module.exports = leagueController