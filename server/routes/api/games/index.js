const router = require('express').Router();

const poolRoutes = require('./pool-routes')

router.use('/pool', poolRoutes);

module.exports = router