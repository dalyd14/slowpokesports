const fetch = require('node-fetch');
const { getCurrentSearchDates, getSpecifiedSearchDates, transformToSlowpokeSchedule } = require('./utils')

const { espn_api_dates_urls, espn_api_schedule_urls } = require('./config')

const { Schedule, Team } = require('../../../model');

const dropCollection = () => {
    return new Promise( async (res, rej) => {
        try {
            await Schedule.collection.drop()
            console.log("Schedule collection drop successfull")
            res(true)
        } catch (e) {
            console.log("Schedule collection doesn't already exists or there was an error dropping it.")
            rej(false)
        }            
    })
}

const createNewSchedule = async (type, years, league, weeks) => {

    const teams = await Team.find()

    const searchObj = espn_api_schedule_urls.find(api => api.league === league)
    Promise.all([fetch(searchObj.url + `&dates=${years[0]}`), fetch(searchObj.url + `&dates=${years[1]}`)])
    .then(responses => {
        return Promise.all(responses.map(resp => resp.json()))
    })
    .then(schedules => {
        const games = schedules.map(schedule => {
            return schedule.events.filter(event => {
                return event.season.year === Math.min(...years) && type.includes(event.season.type)
            })
        })

        const returnSchedule = games.flat(Infinity)

        const readySchedule = returnSchedule.map(event => transformToSlowpokeSchedule(event, teams, league, weeks))

        return Schedule.insertMany(readySchedule)
    })
    .then(result => {
        if (result) {
            console.log(`Successfully added ${result.length} record${result.length!==1 ? 's' : ''} from the ${years[0]}-${years[1]} season in the ${league} league.`)
        }
    })
    .catch(e => {
        console.log(`Error loading the schedule from the ${years[0]}-${years[1]} season in the ${league} league.\n`, e)
    })
}

const callSearchDates = (options) => {
    espn_api_dates_urls.forEach(async league => {
        if (!options.league || options.league === league.league) {
            let searchTerms

            if (options.current) {
                searchTerms = await getCurrentSearchDates(league.url)
            } else {
                searchTerms = await getSpecifiedSearchDates(league.url, options.season, options.seasonType)
            }

            if (searchTerms && searchTerms.searchType && searchTerms.searchYears && searchTerms.seasonWeeks) {
                createNewSchedule(searchTerms.searchType, searchTerms.searchYears, league.league, searchTerms.seasonWeeks)
            } else {
                console.log(searchTerms)
                console.log("Error: No dates for schedule was found")
            }
        }
    })
}
// options object
//   dropTable: boolean
//   current: boolean
//   league: string (either ncaa_fbs or nfl... leave blank for both)
//   season: int (only relevant if current: false)
//   seasonType: [int] (only relevant if current: false)

const getFreshSchedule = async (options) => {
    if (typeof options.dropTable === 'undefined') options.dropTable = false
    if (typeof options.current === 'undefined') options.current = true
    if (((typeof options.season === 'undefined') && !options.current) || 
        ((typeof options.season !== 'undefined') && typeof options.season !== 'number')) {
        console.log("Incorrect options. Please specify a season year as an integer.")
        return
    }
    if (((typeof options.seasonType === 'undefined') && !options.current) || 
        ((typeof options.seasonType !== 'undefined') && !Array.isArray(options.seasonType))) {
        console.log("Incorrect options. Please specify a season type as an array of integers.")
        return
    }
    
    console.log(`Search options:`, options)

    let dropped = !options.dropTable

    if (!dropped) {
        const isDropped = await dropCollection()
        if (isDropped) {
            dropped = true
        } else {
            return
        }
    }

    callSearchDates(options)
}

module.exports = getFreshSchedule