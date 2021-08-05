const { Player, League, User } = require('../model')

const playerController = {
    async getAllPlayers (req, res) {
        const foundPlayers = await Player.find()
            .populate("users")
        res.json(foundPlayers)
    },

    async getOnePlayer ({ params }, res) {
        const foundPlayers = await Player.find({ _id: params._id })
            .populate('users')
            .populate('leagues')
        res.json(foundPlayers)
    },

    // this createNewPlayer is only reached when joining an already established league
    async createNewPlayer ({ body, user }, res) {
        try {

            const foundLeague = await League.findById(body.leagueId)

            if (!foundLeague) {
                throw { error_message: 'This league does not exist.' }
            }

            const numOfPlayersAvailable = foundLeague.settings.leagueSizeLimit - foundLeague.players.length

            if (numOfPlayersAvailable < 1) {
                throw { error_message: 'This league has met its maximum allowed player limit.' }
            }

            if (foundLeague.users.includes(user._id)) {
                throw { error_message: `This user already participates in this league: ${user._id}`}
            }

            // All the checks have passed
            // Okay to add player, add player to users, add player and users to league
            const newPlayer = await Player.create({
                display_name: body.display_name,
                owner: false,
                playerOwner: user._id,
                users: [user._id],
                collaborative: body.collaborative,
                league: foundLeague._id
            })     

            await User.findByIdAndUpdate(user._id, 
                { $push: { players: newPlayer._id } }
            )

            await League.findByIdAndUpdate(
                body.leagueId, 
                {
                    $push: { players: newPlayer._id, users: user._id }
                }
            )

            res.json(newPlayer)            
        } catch (e) {
            res.status(400).json({ message: `An error occured creating this player`, ...e })
        }
    },

    async deletePlayer ({ params, user }, res) {
        try {

            const findPlayer = await Player.findById(params._id)
            if (!findPlayer) {
                throw { error_message: 'This player does not exist' }
            } else if (findPlayer.playerOwner != user._id) {
                throw { error_message: 'Only the player owner can delete the player' }
            }

            const deletedPlayer = await Player.findByIdAndDelete(params._id)

            Promise.all(
                deletedPlayer.users.map(usr => 
                    User.findByIdAndUpdate(
                        usr._id, 
                        { $pull: { players: params._id } }
                    )
                )
            ).then(resp => {
                return Promise.all(
                    deletedPlayer.users.map(usr => 
                        League.findByIdAndUpdate(
                            deletedPlayer.league,
                            { $pull: { players: params._id, users: usr._id } }
                        )
                    )
                )
            })
            .then(resp => {
                res.json(deletedPlayer) 
            })
            .catch(e => {
                res.status(400).json({ message: "An error occurred while removing the player and user ids" })
            })
                  
        } catch (e) {
            res.status(400).json({ message: "An error occurred while deleting the user.", ...e })
        }
    }
}

module.exports = playerController