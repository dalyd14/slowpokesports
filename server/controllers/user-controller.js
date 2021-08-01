const { User, Player, League } = require('../model')

const { signToken } = require('../utils/auth')

const userController = {
    async getAllUsers (req, res) {
        const foundUsers = await User.find().select('-password').populate("players")
        res.json(foundUsers)
    },

    async getOneUser ({ params }, res) {
        const foundUsers = await User.find({ email: params.email })
            .populate(
                {
                    path: 'players',			
                    populate: { 
                        path:  'league'
                    }
                }
            )
        res.json(foundUsers)
    },

    async createNewUser ({ body }, res) {
        try {
            const newUser = await User.create({
                email: body.email,
                password: body.password,
                first_name: body.first_name,
                last_name: body.last_name,
                players: []
            })

            const user = {
                _id: newUser._id,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name
            }

            const token = signToken(user)

            res.json({user, token})            
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

    async loginUser ({ body }, res) {
        const loginUser = await User.findOne({email: body.email})
            .populate({
                path: 'players',			
                populate: { 
                    path:  'league',
                    select: {
                        'league_id': 1,
                        'display_name': 1,
                        'type': 1,
                        'standings': 1
                    }
                }
            })

        if (!loginUser) {
            res.status(400).json({ message: 'Incorrect credentials'})
            return
        }

        const correctPw = await loginUser.comparePassword(body.password)

        if (!correctPw) {
            res.status(400).json({ message: 'Incorrect credentials'})
            return
        }

        const user = {
            _id: loginUser._id,
            email: loginUser.email,
            first_name: loginUser.first_name,
            last_name: loginUser.last_name
        }

        const token = signToken(user)
        
        res.json({user, token})
    },

    async deleteUser ({ params }, res) {
        try {
            // Check for any leagues that this user is an owner for
            const ownedLeagues = await League.find({ owner: params._id })
            if (ownedLeagues) {
                throw { error_message: `You must change ownership or delete all leagues that you are an owner of: ${ownedLeagues.map(leg => leg.display_name).join(", ")}`}
            }

            // Check for any players that this user is an owner for
            const ownedPlayers = await Player.find({ playerOwner: params._id, 'name.1': {$exists: true} })
            if (ownedPlayers) {
                throw { error_message: `You must change ownership or delete all players that you are an owner of: ${ownedPlayers.map(ply => ply.display_name).join(", ")}`}
            }

            // Deleting User
            const deletedUser = await User.findByIdAndDelete(params._id)

            // Deleting User From Player
            const userPlayers = await Player.find({ users: params._id })
            const deletePlayers = []
            const pullPlayers = []

            userPlayers.forEach(ply => {
                if (ply.users.length <= 1) {
                    deletePlayers.push(ply)
                } else {
                    pullPlayers.push(ply)
                }
            })

            if (deletePlayers.length) {
                await Player.deleteMany({ _id: { $in: deletePlayers.map(del => del._id) } })
                
                const foundPlayers = await League.find({ players: { $in: deletePlayers.map(del => del._id) } })
                foundPlayers.forEach(async ply => {
                    await League.findByIdAndUpdate(ply.league, { players: { $pull: ply._id } })
                })
            }
            
            if (pullPlayers.length) {
                await Player.updateMany(
                    { _id: { $in: pullPlayers.map(pul => pul._id) } },
                    { users: { $pull: params._id } }
                )
            }

            // Removing From League
            await League.updateMany({ users: { $in: params._id } }, { users: { $pull: params._id } })

            res.json(deletedUser)         
        } catch (e) {
            res.status(400).json({ message: "An error occurred while deleting the user.", ...e })
        }
    }
}

module.exports = userController