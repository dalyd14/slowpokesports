const fetch = require('node-fetch');
const { getCurrentSearchDates, getSpecifiedSearchDates, transformToSlowpokeSchedule } = require('./utils')

const { espn_api_dates_urls, espn_api_schedule_urls } = require('./config')

const { Schedule, Team } = require('../../model');

const callUpdateSchedule = async (type, years, league, weeks, weeksFilter) => {

    const teams = await Team.find()

    const searchObj = espn_api_schedule_urls.find(api => api.league === league)
    Promise.all([fetch(searchObj.url + `&dates=${years[0]}`), fetch(searchObj.url + `&dates=${years[1]}`)])
    .then(responses => {
        return Promise.all(responses.map(resp => resp.json()))
    })
    .then( async (schedules) => {
        const games = schedules.map(schedule => {
            return schedule.events.filter(event => {
                return event.season.year === Math.min(...years) && type.includes(event.season.type)
            })
        })

        const returnSchedule = games.flat(Infinity)

        let readySchedule = returnSchedule.map(event => transformToSlowpokeSchedule(event, teams, league, weeks))

        if (weeksFilter) {
            readySchedule = readySchedule.filter(game => weeksFilter.includes(game.week))
        }

        const savedOldGames = await Schedule.find({
            espn_game_id: {
                $in: readySchedule.map(game => game.game_id)
            }            
        })

        const deletedGames = await Schedule.deleteMany({
            espn_game_id: {
                $in: readySchedule.map(game => game.game_id)
            }            
        })

        if (deletedGames.ok && deletedGames.n === deletedGames.deletedCount) {
            console.log(`Successfully deleted ${deletedGames.deletedCount} ${league} record${deletedGames.deletedCount!==1 ? 's' : ''} from the Schedule table`)
        } else {
            console.log(`An error occured deleting the necessary ${league} records`)
        }

        return await Schedule.insertMany(readySchedule, async function(error, docs) {
            if (error) {
                await Schedule.insertMany(savedOldGames)
                console.log(`An error occurred while trying to upload the ${docs.lenght} updated records for ${league}. The old records were re-uploaded.`)
            } else {
                console.log(`Successfully updated ${docs.length} record${docs.length!==1 ? 's' : ''}${weeksFilter ? ' for week' + (weeksFilter.length > 1 ? 's ' : ' ') + weeksFilter.join(', ') : ''} from the ${years[0]}-${years[1]} season in the ${league} league.`)
            }
        })
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
                callUpdateSchedule(searchTerms.searchType, searchTerms.searchYears, league.league, searchTerms.seasonWeeks, options.weeks)
            } else {
                console.log(searchTerms)
                console.log("Error: No dates for schedule was found")
            }
        }
    })
}
// options object
//   current: boolean
//   league: string (either ncaa_fbs or nfl... leave blank for both)
//   season: int (only relevant if current: false)
//   seasonType: [int] (only relevant if current: false)
//   weeks: [int] (leave blank for updating whole season)

const updateSchedule = (options) => {
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
    if (((typeof options.weeks === 'undefined') && !options.current) || 
        ((typeof options.weeks !== 'undefined') && !Array.isArray(options.weeks))) {
        console.log("Incorrect options. Please specify weeks as an array of integers.")
        return
    }
    
    console.log(`Search options:`, options)
    callSearchDates(options)
}

module.exports = updateSchedule