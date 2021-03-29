const router = require('express').Router();
const {
    getAllUsers,
    getOneUser,
    getAllUsersAtCompany,
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
    .route('/:username')
    .get(getOneUser)
    .delete(deleteUser)

router
    .route('/byCompany/:id')
    .get(getAllUsersAtCompany)

module.exports = router