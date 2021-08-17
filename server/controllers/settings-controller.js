const { League, GameConfig } = require('../model')
const SettingsModel = require('../model/LeagueSettings')

const settingsController = {
    async getLeagueSettings ({ params, user }, res) {
        try {
            const findLeague = await League.findById(params._id)
                .select('settings users')
                .populate('settings')
            
            // check if this user is a member of this league
            if (!findLeague) {
                throw { error_message: 'This league does not exist' }
            } else if (!findLeague.users.includes(user._id)) {
                throw { error_message: 'You are not a member of this league, therefore you cannot view the settings' }
            }

            res.json(findLeague.settings)
        } catch (e) {
            res.status(400).json({ message: 'An error occurred while retrieving the settings.', ...e })
        }
    },

    async getLeagueSettingsFields ({ params, user }, res) {
        try {
            const findLeague = await League.findById(params._id)
                .select('settings type users')
                .populate('settings')

            // check if this user is a member of this league
            if (!findLeague) {
                throw { error_message: 'This league does not exist' }
            } else if (!findLeague.users.includes(user._id)) {
                throw { error_message: 'You are not a member of this league, therefore you cannot view the settings' }
            }

            const Settings = require(`../data/leagues/settings/config`)[findLeague.type]

            const leagueSettings = Settings(findLeague.settings)

            res.json(leagueSettings.getFields())
        } catch (e) {
            res.status(400).json({ message: 'An error occurred while retrieving the setting fields.', ...e })
        }
    },
    
    async updateSettings ({ params, body, user }, res) {
        try {
            const findLeague = await League.findById(params._id)
                .select('settings type owner users')
                .populate('settings')
            
            // check if this user is a member of this league
            if (!findLeague) {
                throw { error_message: 'This league does not exist' }
            } else if (!findLeague.users.includes(user._id)) {
                throw { error_message: 'You are not a member of this league, therefore you cannot view the settings' }
            } else if (findLeague.owner != user._id) {
                throw { error_message: 'You must be the league owner to edit the settings.' }
            }

            const copied = {...findLeague.toObject().settings}
            const newSettings = Object.assign(copied, body)

            const Settings = require(`../data/leagues/settings/config`)[findLeague.type]
            const leagueSettings = Settings(newSettings)

            const gameConfig = await GameConfig.findOne({ game_id: findLeague.type })

            const resp = leagueSettings.confirmTiers(gameConfig)

            if (resp.ok) {
                const updatedSettings = await SettingsModel[findLeague.type].findByIdAndUpdate(findLeague.settings._id, leagueSettings.getSettings(), { new: true })
                res.json(updatedSettings)
            } else {
                throw { error_message: resp.message }
            }
            
        } catch (e) {
            res.status(400).json({ message: 'An error occurred while updating the settings.', ...e })
        }
    }
}

module.exports = settingsController