const fetch = require('node-fetch');
const moment = require('moment')

// Function to make call for schedule admin info
const getScheduleAdmin = (api_url, seasonYear) => {
    return new Promise( async (res, rej) => {
        if (seasonYear) {
            api_url += `&dates=${seasonYear}`
        }
        const response = await fetch(api_url)
        const sched_resp = await response.json()
        res(sched_resp)
    })
}

// Function to get current dates and season and weeks
const getCurrentSearchDates = async (api_url) => {

    const sched_resp = await getScheduleAdmin(api_url)

    const { year, type } = sched_resp.leagues[0].season

    let searchYears
    let searchType = [type.type]

    switch (type.type) {
        case 1:
            // Pre-season
            if (sched_resp.events.length) {
                // New Schedule Has Been Released
                // Only update the regular season games
                searchYears = [year, year + 1]
                searchType = [2]
            } else {
                searchType = false
                searchYears = false
            }
            break;
        case 2:
            // Regular season
        case 3:
            // Post-season
            searchYears = [year, year + 1]
            break;
        case 4:
            // Off-season
            if (sched_resp.events.length) {
                // New Schedule Has Been Released
                // Only update the regular season games
                searchYears = [year + 1, year + 2]
                searchType = [2]
            } else {
                // New Schedule has not been released
                searchType = false
                searchYears = false
            }
            break;
        default:
            break;
    }

    const { calendar } = sched_resp.leagues[0]
    const seasonWeeks = getSeasonWeeks(calendar, searchType)

    return { searchType, searchYears, seasonWeeks }
}

// Function to get specified dates and season and weeks
const getSpecifiedSearchDates = async (api_url, seasonYear, seasonTypes) => {
    // if a user declares the 2017 season, we will search for years 2017 and 2018
    const searchYears = [seasonYear, seasonYear + 1]
    // only for the non-current mode will we have multiple type (reg and post season)
    const searchType = seasonTypes

    const sched_resp = await getScheduleAdmin(api_url, seasonYear)
    const { calendar } = sched_resp.leagues[0]

    const seasonWeeks = getSeasonWeeks( calendar, seasonTypes)

    return { searchYears, searchType, seasonWeeks }
}

const getSeasonWeeks = (calendar, seasonTypes) => {
    const typeCals = calendar.filter(types => seasonTypes.includes(parseInt(types.value)))
    const entries = []
    typeCals.forEach(typ => entries.push(
        ...typ.entries.map(e => {
            e.seasonType = parseInt(typ.value)
            return e
        })
    ))
    const seasonWeeks = entries.map(e => {
        return {
            week: parseInt(e.value),
            seasonType: parseInt(e.seasonType),
            startDate: e.startDate,
            endDate: e.endDate
        }
    })
    return seasonWeeks
}

const getWeekNumber = (gameDate, seasonWeeks) => {
    const selectedWeek = seasonWeeks.find(week => (moment(gameDate).isSameOrAfter(week.startDate) && moment(gameDate).isSameOrBefore(week.endDate)))

    return selectedWeek.week
}

const transformToSlowpokeSchedule = (espnEvent, teams, league, weeks, updateOrNew) => {
    
    const home = espnEvent.competitions[0].competitors.find(comp => comp.homeAway === 'home')
    const away = espnEvent.competitions[0].competitors.find(comp => comp.homeAway === 'away')

    const homeObjID = teams.find(team => team.espn_id === `${league}_${home.id}`)?._id || home.team.displayName
    const awayObjID = teams.find(team => team.espn_id === `${league}_${away.id}`)?._id || away.team.displayName

    // Check for odds
    let odds
    if (espnEvent.competitions[0].odds) {
        const defaultOdds = espnEvent.competitions[0].odds.find(odd => odd.provider.priority === 1)
        const oddText = defaultOdds.details.split(" ")
        let line = parseFloat(oddText[1])

        let favorite = espnEvent.competitions[0].competitors.find(comp => comp.team.abbreviation === oddText[0])

        favorite = favorite ? favorite.homeAway : false
        if (isNaN(line)) {
            line = null
        }
        odds = {
            line,
            favorite
        }
    } else if (updateOrNew !== "update") {
        odds = {
            line: 0,
            favorite: 'not set'
        }
    }

    const weekNum = getWeekNumber(espnEvent.date, weeks)

    const slowpokeEvent = {
        espn_game_id: espnEvent.uid,
        league_type: league,
        home_team: homeObjID || home.team.location,
        home_rank: home.curatedRank?.current === 99 ? 0 : (home.curatedRank?.current || 0),
        away_team: awayObjID || away.team.location,
        away_rank: away.curatedRank?.current === 99 ? 0 : (away.curatedRank?.current || 0),
        start_time: espnEvent.date,
        season: espnEvent.season.year,
        week: weekNum,
        seasonType: espnEvent.season.type,
        completed: espnEvent.status.type.completed,
        home_score: Number(home.score) || 0,
        away_score: Number(away.score) || 0,
        display_name: espnEvent.shortName
    }

    if (odds) {
        slowpokeEvent.odds = odds
    }
    
    return slowpokeEvent
}

module.exports = {
    getScheduleAdmin,
    getCurrentSearchDates,
    getSpecifiedSearchDates,
    getSeasonWeeks,
    getWeekNumber,
    transformToSlowpokeSchedule
}