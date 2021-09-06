const router = require('express').Router();
const {
    getAllSchedulesFromLeagues,
    ownerUpdateEvents,
    playerUpdateEvents
} = require('../../../controllers/gameControllers/pool-controller')

const { authMiddleware } = require('../../../utils/auth')

router
    .route('/getSchedules/:_id')
    .post(authMiddleware, getAllSchedulesFromLeagues)

router
    .route('/ownerUpdate/:_id')
    .put(authMiddleware, ownerUpdateEvents)

router
    .route('/playerUpdate/:_id')
    .put(authMiddleware, playerUpdateEvents)

module.exports = router