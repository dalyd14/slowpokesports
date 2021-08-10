const router = require('express').Router();
const {
    getAllLeagues,
    getOneLeague,
    createNewLeague,
    deleteLeague,
    kickOutPlayer,
    changeOpenLeague,
    joinLeague,
    switchLeagueOwner,
    generalUpdateLeague,
    getLeagueSettings,
    getLeagueSettingsFields
} = require('../../controllers/league-controller')

const { authMiddleware } = require('../../utils/auth')

router
    .route('/')
    .get(authMiddleware, getAllLeagues)
    .post(authMiddleware, createNewLeague)

router
    .route('/changeStatus/:_id')
    .put(authMiddleware, changeOpenLeague)

router
    .route('/join/:_id')
    .post(authMiddleware, joinLeague)

router
    .route('/switchOwner/:_id')
    .put(authMiddleware, switchLeagueOwner)

router
    .route('/update/:_id')
    .put(authMiddleware, generalUpdateLeague)

router
    .route('/kickOutPlayer/:_id')
    .post(authMiddleware, kickOutPlayer)

router
    .route('/getSettings/:_id')
    .post(authMiddleware, getLeagueSettings)

router
    .route('/getSettingsFields/:_id')
    .post(authMiddleware, getLeagueSettingsFields)

router
    .route('/:_id')
    .get(authMiddleware, getOneLeague)
    .delete(authMiddleware, deleteLeague)

module.exports = router