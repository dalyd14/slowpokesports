const router = require('express').Router();

const userRoutes = require('./user-routes')
const leagueRoutes = require('./league-routes')

router.use('/user', userRoutes);
router.use('/league', leagueRoutes);

module.exports = router