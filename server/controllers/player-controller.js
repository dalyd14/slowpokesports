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
                .populate('users')
                .populate('settings')

            const numOfPlayersAvailable = foundLeague.settings.leagueSizeLimit - foundLeague.players.length

            if (numOfPlayersAvailable < 1) {
                throw { error_message: 'This league has met its maximum allowed player limit.' }
            }
            
            const repeatedUsers = []
            const userEmails = foundLeague.users.map(user => user.email)
            body.userEmails.forEach(userEmail => {
                if (userEmails.includes(userEmail)) {
                    repeatedUsers.push(userEmail)
                }
            })

            if (repeatedUsers.length > 0) {
                throw { error_message: `Some of these users already participate in this league: ${repeatedUsers.join(", ")}`}
            }

            // All the checks have passed
            // Okay to add player, add player to users, add player and users to league
            const userByEmail = await User.find({ email: { $in: body.userEmails } })
          
            const newPlayer = await Player.create({
                display_name: body.display_name,
                owner: false,
                playerOwner: user._id,
                collaborative: body.collaborative,
                users: userByEmail.map(usr => usr._id),
                league: body.leagueId
            })

            await User.updateMany(
                { _id: { $in: userByEmail.map(usr => usr._id) } }, 
                { players: { $push: newPlayer._id } }
            )

            await League.findByIdAndUpdate(
                body.leagueId, 
                {
                    players: { $push: newPlayer._id },
                    users: { $push: userByEmail.map(usr => usr._id) }
                }
            )

            res.json(newPlayer)            
        } catch (e) {
            switch (e.code) {
                case 11000:
                    res.status(400).json({ message: 'A user with this email already exists!' })
                    break;
                default:
                    res.status(400).json({ message: `An error occured creating this user`, ...e })
                    break;
            }
            return
        }
    },

    async deletePlayer ({ params }, res) {
        try {
            const deletedPlayer = await Player.findByIdAndDelete(params._id)

            Promise.all([
                deletedPlayer.users.map(usr => 
                    User.findByIdAndUpdate(
                        usr._id, 
                        { $pull: { players: params._id } }
                    )
                ),
                deletedPlayer.users.map(usr => 
                    League.findByIdAndUpdate(
                        usr._id,
                        { $pull: { players: params._id, users: usr._id } }
                    )
                )
            ])
            .catch(e => {
                res.status(400).json({ message: "An error occurred while removing the player and user ids" })
            })

            res.json(deletedPlayer)       
        } catch (e) {
            res.status(400).json({ message: "An error occurred while deleting the user.", ...e })
        }
    }
}

module.exports = playerController