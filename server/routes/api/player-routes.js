const router = require('express').Router();
const {
    getAllPlayers,
    getOnePlayer,
    createNewPlayer,
    deletePlayer
} = require('../../controllers/player-controller')

const { authMiddleware } = require('../../utils/auth')

router
    .route('/')
    .get(authMiddleware, getAllPlayers)
    .post(authMiddleware, createNewPlayer)

router
    .route('/:_id')
    .get(authMiddleware, getOnePlayer)
    .delete(authMiddleware, deletePlayer)

module.exports = router