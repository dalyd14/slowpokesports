const router = require('express').Router();
const {
    getAllPlayers,
    getOnePlayer,
    createNewPlayer,
    deletePlayer,
    changeCollaborative,
    joinPlayer,
    switchPlayerOwner,
    generalUpdatePlayer
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
    .put(authMiddleware, joinPlayer)

router
    .route('/update/:_id')
    .put(authMiddleware, switchPlayerOwner)

router
    .route('/switchOwner/:_id')
    .put(authMiddleware, generalUpdatePlayer)

router
    .route('/:_id')
    .get(authMiddleware, getOnePlayer)
    .delete(authMiddleware, deletePlayer)

module.exports = router