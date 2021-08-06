const { League, Player, User } = require('../model')

const leagueController = {
    async getAllLeagues (req, res) {
        const foundLeagues = await League.find()
        res.json(foundLeagues)
    },

    async getOneLeague ({ params }, res) {
        try {
            const foundLeague = await League.findById(params._id).populate('players')

            if (!foundLeague) {
                throw { error_message: "This league does not exist." }
            }

            res.json(foundLeague)
        } catch (e) {
            res.status(400).json({ message: "An error occurred while finding the league.", ...e })
        }

    },

    async createNewLeague ({ body, user }, res) {
        try {     
            const newLeague = await League.create({
                league_id: body.league.league_id,
                signup_key: body.league.signup_key,
                display_name: body.league.display_name,
                type: body.league.type,
                owner: user._id,
                users: [user._id],
                players: [],
                banned_players: [],
                settings: body.league.settings,
                standings: [],
                pick_history: []
            })

            const newPlayer = await Player.create({
                display_name: body.player.display_name,
                owner: true,
                playerOwner: user._id,
                users: [user._id],
                collaborative: body.player.collaborative,
                league: newLeague._id
            })

            await League.findByIdAndUpdate(newLeague._id, 
                { $push: { players: newPlayer._id } }
            )

            await User.findByIdAndUpdate(user._id, 
                { $push: { players: newPlayer._id } }
            )

            res.json({league: newLeague, player: newPlayer})            
        } catch (e) {
            res.status(400).json({ message: 'An error occurred while the league was being created', ...e })
        }
    },

    async deleteLeague ({ params, user }, res) {

        try {
            const foundLeague = await League.findById(params._id).select("_id owner players")

            if (!foundLeague) {
                throw { error_message :'This league could not be found!' }
            }
            else if (foundLeague.owner != user._id) {
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
                    res.json({ success: 'League successfully deleted' })
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
    },

    async kickOutPlayer ({ params, body, user }) {
   
        try {
            const foundLeague = await League.findOne({ league_id: params.league_id }).select("_id owner players").populate("players")

            if (!foundLeague) {
                throw { error_message :'This league could not be found!' }
            } else if (foundLeague.owner != user._id) {
                throw { error_message :'You do not have the proper permissions to perform this operation.' }
            } else if (!foundLeague.players.includes(body.removePlayer)) {
                throw { error_message :'This player does not participate in this league.' }
            }

            const playerUserIds = foundLeague.players
                .findOne(player => player._id == body.removePlayer).users
                .map(user => user._id)

            if (playerUserIds.includes(user._id)) {
                throw { error_message :'League owners cannot remove themselves from their league. Change ownership and then you can leave.' }
            }

            // remove player and users from the league
            const updatedLeague = await League.findByIdAndUpdate(params._id, { $pull: { players: body.removePlayer, users: { $in: playerUserIds } } })

            // delete player
            await Player.findByIdAndDelete(body.removePlayer)

            // remove players from the users
            await User.updateMany({ _id: { $in: playerUserIds } }, { $pull: { players: params._id } })

            res.json(updatedLeague)

        } catch (e) {
            res.status(400).json({ message: "An error occurred while deleting the league.", ...e })
        }     
    }
}

module.exports = leagueController