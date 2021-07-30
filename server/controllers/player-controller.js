const { User } = require('../model')

const { signToken } = require('../utils/auth')

const userController = {
    async getAllUsers (req, res) {
        const foundUsers = await User.find().select('-password').populate("leagues", "league_id display_name type")
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
            email: loginUser.email,
            first_name: loginUser.first_name,
            last_name: loginUser.last_name
        }

        const token = signToken(user)
        
        res.json({user, token})
    },

    async deleteUser ({ params }, res) {

        try {
            const deletedUser = await User.deleteOne({ email: params.email })

            if (deletedUser.ok) {
                if (deletedUser.deletedCount > 0) {
                    res.json(deletedUser)
                } else {
                    res.status(400).json({message: "No user found or deleted."})
                }
            } else {
                res.status(400).json({message: "An error occurred while deleting the user."})
            }            
        } catch (e) {
            res.status(400).json({ message: "An error occurred while deleting the user.", ...e })
        }
    }
}

module.exports = userController