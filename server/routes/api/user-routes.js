const router = require('express').Router();
const {
    getAllUsers,
    getOneUser,
    createNewUser,
    loginUser,
    deleteUser
} = require('../../controllers/user-controller')

const { authMiddleware } = require('../../utils/auth')

router
    .route('/')
    .get(getAllUsers)
    .post(createNewUser)

router
    .route('/login')
    .post(loginUser)

router
    .route('/:_id')
    .get(getOneUser)
    .delete(authMiddleware, deleteUser)

module.exports = router