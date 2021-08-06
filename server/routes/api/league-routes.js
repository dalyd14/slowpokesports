const router = require('express').Router();
const {
    getAllLeagues,
    getOneLeague,
    createNewLeague,
    deleteLeague,
    kickOutPlayer
} = require('../../controllers/league-controller')

const { authMiddleware } = require('../../utils/auth')

router
    .route('/')
    .get(authMiddleware, getAllLeagues)
    .post(authMiddleware, createNewLeague)

router
    .route('kickOutPlayer/:_id')

router
    .route('/:_id')
    .get(authMiddleware, getOneLeague)
    .delete(authMiddleware, deleteLeague)

module.exports = router