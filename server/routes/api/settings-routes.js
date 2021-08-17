const router = require('express').Router();
const {
    getLeagueSettings,
    getLeagueSettingsFields,
    updateSettings
} = require('../../controllers/settings-controller')

const { authMiddleware } = require('../../utils/auth')

router
    .route('/fields/:_id')
    .get(authMiddleware, getLeagueSettingsFields)

router
    .route('/:_id')
    .get(authMiddleware, getLeagueSettings)
    .put(authMiddleware, updateSettings)

module.exports = router