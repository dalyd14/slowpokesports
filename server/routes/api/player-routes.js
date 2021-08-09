const router = require('express').Router();
const {
    getAllPlayers,
    getOnePlayer,
    createNewPlayer,
    deletePlayer,
    changeCollaborative,
    joinPlayer,
    switchPlayerOwner,
    generalUpdatePlayer,
    kickOutUser,
    leaveLeague
} = require('../../controllers/player-controller')

const { authMiddleware } = require('../../utils/auth')

router
    .route('/')
    .get(authMiddleware, getAllPlayers)
    .post(authMiddleware, createNewPlayer)

router
    .route('/collaborate/:_id')
    .put(authMiddleware, changeCollaborative)

router
    .route('/join/:inviteToken')
    .post(authMiddleware, joinPlayer)

router
    .route('/update/:_id')
    .put(authMiddleware, switchPlayerOwner)

router
    .route('/switchOwner/:_id')
    .put(authMiddleware, generalUpdatePlayer)

router
    .route('/kickOutUser/:_id')
    .post(authMiddleware, kickOutUser)

router
    .route('/leaveLeague/:_id')
    .post(authMiddleware, leaveLeague)

router
    .route('/:_id')
    .get(authMiddleware, getOnePlayer)
    .delete(authMiddleware, deletePlayer)

module.exports = router