const router = require('express').Router();

const userRoutes = require('./user-routes')
const leagueRoutes = require('./league-routes')
const playerRoutes = require('./player-routes')
const settingsRoutes = require('./settings-routes')

router.use('/user', userRoutes);
router.use('/league', leagueRoutes);
router.use('/player', playerRoutes);
router.use('/settings', settingsRoutes)

module.exports = router