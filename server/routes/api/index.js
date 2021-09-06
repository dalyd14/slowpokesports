const router = require('express').Router();

const userRoutes = require('./user-routes')
const leagueRoutes = require('./league-routes')
const playerRoutes = require('./player-routes')
const settingsRoutes = require('./settings-routes')
const scheduleRoutes = require('./schedule-routes')
const gameRoutes = require('./games')

router.use('/user', userRoutes);
router.use('/league', leagueRoutes);
router.use('/player', playerRoutes);
router.use('/settings', settingsRoutes)
router.use('/schedule', scheduleRoutes)
router.use('/games', gameRoutes)

module.exports = router