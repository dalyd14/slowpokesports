const router = require('express').Router();
const {
    getAllSchedulesFromLeagues,
    ownerUpdateSchedule,
    ownerUpdatePicks,
    playerUpdatePicks
} = require('../../../controllers/gameControllers/pool-controller')

const { authMiddleware } = require('../../../utils/auth')

router
    .route('/getSchedules/:_id')
    .post(authMiddleware, getAllSchedulesFromLeagues)

router
    .route('/ownerUpdateSchedule/:_id')
    .put(authMiddleware, ownerUpdateSchedule)

router
    .route('/ownerUpdateEvent/:_id')
    .put(authMiddleware, ownerUpdatePicks)

router
    .route('/playerUpdate/:_id')
    .put(authMiddleware, playerUpdatePicks)

module.exports = router