const { User } = require('../model')

const { signToken } = require('../utils/auth')

const userController = {
    async getAllUsers (req, res) {
        const foundUsers = await User.find().populate("leagues", "league_id display_name type")
        res.json(foundUsers)
    },

    async getOneUser ({ params }, res) {
        const foundUsers = await User.find({ username: params.username })
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

        const newUser = await User.create({
            email: body.email,
            password: body.password,
            first_name: body.first_name,
            last_name: body.last_name,
            leagues: []
        })

        const user = {
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name
        }

        const token = signToken(user)

        res.json({user, token})
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
        const deletedUser = await User.deleteOne({ username: params.username })

        res.json(deletedUser)
    }

}

module.exports = userController