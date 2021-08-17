const { pool } = require('../../model/LeagueSchedules')

const poolController = {
    async getAllSchedulesFromLeagues ({ params, body }, res) {
        searchParams = {
            league: params._id
        }

        if (body) {
            searchParams = {
                ...searchParams,
                body
            }
        }
        const foundSchedules = await pool.find(searchParams)
        res.json(foundSchedules)
    }
}

module.exports = poolController