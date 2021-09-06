const router = require('express').Router();
const {
    getSchedules
} = require('../../controllers/schedule-controller')

router
    .route('/')
    .get(getSchedules)

module.exports = router