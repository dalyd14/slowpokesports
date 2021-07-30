const router = require('express').Router();
const {
    getAllLeagues,
    getOneLeague,
    createNewLeague,
    deleteLeague
} = require('../../controllers/league-controller')

const { authMiddleware } = require('../../utils/auth')

router
    .route('/')
    .get(authMiddleware, getAllLeagues)
    .post(authMiddleware, createNewLeague)

router
    .route('/:league_id')
    .get(authMiddleware, getOneLeague)
    .delete(authMiddleware, deleteLeague)

module.exports = router