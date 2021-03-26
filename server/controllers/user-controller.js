const { User } = require('../../model')

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
        const newUser = new User({
            email: body.email,
            username: body.username,
            password: body.password,
            first_name: body.first_name,
            last_name: body.last_name,
            permission: body.permission,
            company: body.company
        })
    
        const savedUser = await newUser.save()
        res.json(savedUser)
    },

    async deleteUser ({ params }, res) {
        const deletedUser = await User.deleteOne({ username: params.username })

        res.json(deletedUser)
    }

}

module.exports = userController