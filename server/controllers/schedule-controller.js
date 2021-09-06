const { Schedule } = require('../model')

const scheduleController = {
    async getSchedules ({ body }, res) {
        try {
            const findSchedule = await Schedule.find(body)
            
            // check if this user is a member of this league
            if (!findSchedule.length) {
                throw { error_message: 'No schedules could be found with these parameters.' }
            }

            res.json(findSchedule)
        } catch (e) {
            res.status(400).json({ message: 'An error occurred while retrieving the schedule.', ...e })
        }
    }
}

module.exports = scheduleController