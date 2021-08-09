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
                collaborative: false,
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
    },

    async changeOpenLeague ({ params, body, user }, res) {
        try {
            const findLeague = await League.findById(params._id)
            if (!findLeague) {
                throw { error_message: 'This league does not exist' }
            } else if (findLeague.owner != user._id) {
                throw { error_message: 'Only the league owner can edit the league' }
            }
            
            let updateLeague
            
            if (body.open_league) {
                // The owner has made this league open to join
                updateLeague = await League.findByIdAndUpdate(params._id, { open_league: body.open_league }, { new: true })
            } else {
                updateLeague = await League.findByIdAndUpdate(params._id, { open_league: false }, { new: true })
            }

            res.json(updateLeague)

        } catch (e) {
            res.status(400).json({ message: "An error occurred while changing the open status of the league.", ...e })
        }
    },

    async joinLeague ({ params, body, user }, res) {
        try {
            // check to see if invite token was provided
            if (!body.signUpKey) {
                throw { error_message: 'Please provide a proper sign up key for this league.' }
            }

            const findLeague = await League.findById(params._id)

            if (!findLeague) {
                throw { error_message: 'This league does not exist.' }
            } else if (findLeague.users.includes(user._id)) {
                throw { error_message: 'You are already a member of this league!' }
            } else if (!findLeague.open_league) {
                throw { error_message: 'This league is not open for joining.' }
            }

            const numOfPlayersAvailable = findLeague.settings.leagueSizeLimit - findLeague.players.length

            if (numOfPlayersAvailable < 1) {
                throw { error_message: 'This league has met its maximum allowed player limit.' }
            }

            if (findLeague.signup_key !== body.signUpKey) {
                throw { error_message: 'The signup key you provided does not match this league.' }
            }

            const newPlayer = await Player.create({
                display_name: body.display_name,
                owner: false,
                playerOwner: user._id,
                users: [user._id],
                collaborative: false,
                league: findLeague._id
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

            res.json({league: findLeague, player: newPlayer})

        } catch (e) {
            res.status(400).json({ message: "An error occurred while trying to join this league.", ...e })
        }
    },

    async switchLeagueOwner ({ params, body, user }) {
        try {
            const findLeague = await League.findById(params._id)
            if (!findLeague) {
                throw { error_message: 'This league does not exist' }
            } else if (findLeague.owner != user._id) {
                throw { error_message: 'Only the league owner can edit the league' }
            }

            // check if the user that the owner wants to switch to exists in the league
            if (!findLeague.users.includes(body.newOwner)) {
                throw { error_message: 'The intended new owner does not exist in the league.' }
            }

            // if all checks above pass then change the owner
            const updateLeague = await League.findByIdAndUpdate(params._id, { owner: body.newOwner })

            res.json(updateLeague)

        } catch (e) {
            res.status(400).json({ message: "An error occurred while trying to switch the league owner.", ...e })
        }
    },

    async generalUpdateLeague ({ params, body, user }) {
        try {
            const findLeague = await League.findById(params._id)
            if (!findLeague) {
                throw { error_message: 'This league does not exist' }
            } else if (findLeague.owner != user._id) {
                throw { error_message: 'Only the league owner can edit the league' }
            }

            // only fields that can be updated
            // display_name
            const acceptedFields = ['signup_key', 'display_name']

            // remove any key-value pairs that are empty
            for (key in body) {
                if (!acceptedFields.includes(key) || !body[key]) {
                    delete body[key]
                }
            }

            // if all checks above pass then change the playerOwner
            const updateLeague = await League.findByIdAndUpdate(params._id, body)

            res.json(updateLeague)

        } catch (e) {
            res.status(400).json({ message: "An error occurred while trying to update the league.", ...e })
        }
    },
}

module.exports = leagueController