const router = require('express').Router();

const companyRoutes = require('./company-routes')
const userRoutes = require('./user-routes')
const readerRoutes = require('./reader-routes')
const antennaRoutes = require('./antenna-routes.js')
const tagRoutes = require('./tag-routes')

router.use('/company', companyRoutes);
router.use('/user', userRoutes);
router.use('/reader', readerRoutes);
router.use('/antenna', antennaRoutes);
router.use('/tag', tagRoutes)

module.exports = router