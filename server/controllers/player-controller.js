const { v4: uuidv4 } = require('uuid')

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
            res.status(400).json({ message: "An error occurred while deleting the player.", ...e })
        }
    },

    async changeCollaborative ({ params, body, user }, res) {
        try {
            const findPlayer = await Player.findById(params._id)
            if (!findPlayer) {
                throw { error_message: 'This player does not exist' }
            } else if (findPlayer.playerOwner != user._id) {
                throw { error_message: 'Only the player owner can edit the player' }
            }
            
            let updatePlayer
            
            if (body.collaborative) {
                // The playerOwner has made this player open to collaboration
                const inviteToken = uuidv4()
                updatePlayer = await Player.findByIdAndUpdate(params._id, { collaborative: body.collaborative, inviteToken: inviteToken }, { new: true })
            } else {
                updatePlayer = await Player.findByIdAndUpdate(params._id, { collaborative: body.collaborative, inviteToken: '' }, { new: true })
            }

            res.json(updatePlayer)

        } catch (e) {
            res.status(400).json({ message: "An error occurred while changing the collaboration of the player.", ...e })
        }
    },

    async joinPlayer ({ params, user }, res) {
        try {
            // check to see if invite token was provided
            if (!params.inviteToken) {
                throw { error_message: 'Please provide a proper invite token for a player.' }
            }

            // Check to see if there was even a player found with this invite token
            // Check to see if this user is already a member of the player
            // check to see if the player is still collaborative
            const findPlayer = await Player.findOne({ inviteToken: params.inviteToken })
            if (!findPlayer) {
                throw { error_message: 'This invite token is not tied to any player.' }
            } else if (findPlayer.users.includes(user._id)) {
                throw { error_message: 'You are already a member of this player!' }
            } else if (!findPlayer.collaborative) {
                throw { error_message: 'An error occurred, this player is not open for collaboration.' }
            }

            // Finally check if this user is already a part of the league this player participates in
            const foundLeague = await League.findById(findPlayer.league)
            if (foundLeague.users.includes(user._id)) {
                throw { error_message: 'This user is already a part of the league that this player participates in. The same user cannot have more than one player in the same league.' }
            }

            // if all the above checks pass, add the user to the player
            const updatePlayer = await Player.findOneAndUpdate({ inviteToken: params.inviteToken }, { $push: { users: user._id } }, { new: true })
            
            // then add the user to the league this player is a part of
            await League.findByIdAndUpdate(findPlayer.league, { $push: { users: user._id } })

            // finally add player to this user
            await User.findByIdAndUpdate(user._id, { $push: { players: findPlayer._id } })

            res.json(updatePlayer)

        } catch (e) {
            res.status(400).json({ message: "An error occurred while trying to join this player.", ...e })
        }
    },

    async switchPlayerOwner ({ params, body, user }) {
        try {
            const findPlayer = await Player.findById(params._id)
            if (!findPlayer) {
                throw { error_message: 'This player does not exist' }
            } else if (findPlayer.playerOwner != user._id) {
                throw { error_message: 'Only the player owner can edit the player' }
            }

            // check if the user that the owner wants to switch to exists in the player
            if (!findPlayer.users.includes(body.newOwner)) {
                throw { error_message: 'The intended new owner does not exist in the player.' }
            }

            // if all checks above pass then change the playerOwner
            const updatePlayer = await Player.findByIdAndUpdate(params._id, { playerOwner: body.newOwner })

            res.json(updatePlayer)

        } catch (e) {
            res.status(400).json({ message: "An error occurred while trying to switch the player owner.", ...e })
        }
    },

    async generalUpdatePlayer ({ params, body, user }) {
        try {
            const findPlayer = await Player.findById(params._id)
            if (!findPlayer) {
                throw { error_message: 'This player does not exist' }
            } else if (findPlayer.playerOwner != user._id) {
                throw { error_message: 'Only the player owner can edit the player' }
            }

            // only fields that can be updated
            // display_name
            const acceptedFields = ['display_name']

            // remove any key-value pairs that are empty
            for (key in body) {
                if (!acceptedFields.includes(key) || !body[key]) {
                    delete body[key]
                }
            }

            // if all checks above pass then change the playerOwner
            const updatePlayer = await Player.findByIdAndUpdate(params._id, body)

            res.json(updatePlayer)

        } catch (e) {
            res.status(400).json({ message: "An error occurred while trying to switch the player owner.", ...e })
        }
    },

    async kickOutUser ({ params, body, user }) {
        try {

            const findPlayer = await Player.findById(params._id)
            if (!findPlayer) {
                throw { error_message: 'This player does not exist' }
            } else if (findPlayer.playerOwner != user._id) {
                throw { error_message: 'Only the player owner can remove users from the player' }
            } else if (!findPlayer.users.includes(body.removeUser)) {
                throw { error_message: 'This user does not exist for this player' }
            } else if (body.removeUser != user._id) {
                throw { error_message: 'You cannot remove yourself from the player. Change ownership and then leave the player.'}
            }

            const updatedPlayer = await Player.findByIdAndUpdate(params._id, { $pull: { users: body.removeUser } })

            await User.findByIdAndUpdate(body.removeUser, { $pull: { players: params._id } })

            await League.findByIdAndUpdate(findPlayer.league, { $pull: { users: body.removeUser } })


            res.json(updatedPlayer) 
                  
        } catch (e) {
            res.status(400).json({ message: "An error occurred while removing the user from the player.", ...e })
        }
    },

    async leaveLeague ({ params, body, user }) {
        try {
            const findPlayer = await Player.findById(params._id)
            const findLeague = await League.findById(body.leaveLeague)

            if (!findPlayer) {
                throw { error_message: 'This player does not exist' }
            } else if (findPlayer.playerOwner != user._id) {
                throw { error_message: 'Only the player owner can remove player from league' }
            }

            if (!findLeague) {
                throw { error_message: 'This league does not exist' }
            } else if (findPlayer.league != body.leaveLeague) {
                throw { error_message: 'This player does not participate in the league you want to leave.' }
            } else if (!findPlayer.users.includes(findLeague.owner)) {
                throw { error_message: 'This player cannot leave the league because the owner of the league is part of this player.' }
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
                            body.leaveLeague,
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
            res.status(400).json({ message: "An error occurred while removing the player from the league.", ...e })
        }
    }
}

module.exports = playerController