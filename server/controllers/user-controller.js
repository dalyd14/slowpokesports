const { User, Company } = require('../model')
const { findOne } = require('../model/Company')

const { signToken } = require('../utils/auth')

const userController = {
    async getAllUsers (req, res) {
        const foundUsers = await User.find().populate("company", "-readers -_id -__v")
        res.json(foundUsers)
    },

    async getOneUser ({ params }, res) {
        const foundUsers = await User.find({ username: params.username })
        res.json(foundUsers)
    },

    async getAllUsersAtCompany ({ params }, res) {
        const foundUsers = await User.find({ company: params.id })
        res.json(foundUsers)
    },

    async createNewUser ({ body }, res) {
        const username = body.email.split('@')[0]

        const company = await Company.findOne({ signup_key: body.signup_key })
            .select('_id display_name')
            .lean()

        const newUser = await User.create({
            email: body.email,
            username: username,
            password: body.password,
            first_name: body.first_name,
            last_name: body.last_name,
            permission: 'employee',
            company: company._id
        })

        const user = {
            email: newUser.email,
            username: newUser.username,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            permission: newUser.permission,
            company: company
        }

        const token = signToken(user)

        res.json({user, token})
    },

    async loginUser ({ body }, res) {
        const loginUser = await User.findOne({email: body.email})
            .populate({
                path: 'company',
                select: '_id display_name'
            })
        if (!loginUser) {
            res.status(400).json({ message: 'Incorrect credentials'})
        }

        const correctPw = await loginUser.comparePassword(body.password)

        if (!correctPw) {
            res.status(400).json({ message: 'Incorrect credentials'})
        }

        const user = {
            username: loginUser.username,
            email: loginUser.email,
            first_name: loginUser.first_name,
            last_name: loginUser.last_name,
            permission: loginUser.permission,
            company: loginUser.company
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