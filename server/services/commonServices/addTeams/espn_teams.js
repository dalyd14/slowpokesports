const fetch = require('node-fetch');

const { api_urls } = require('./config')

const { Team } = require('../../../model')

const dropCollection = () => {
    return new Promise( async (res, rej) => {
        try {
            await Team.collection.drop()
            console.log("Team collection drop successful")
            res(true)
        } catch (e) {
            console.log("Team collection doesn't already exists or there was an error dropping it.")
            rej(false)
        }            
    })
}

const callTeams = async (options) => {
    let dropped = !options.dropTable

    if (!dropped) {
        const isDropped = await dropCollection()
        if (isDropped) {
            dropped = true
        } else {
            return
        }
    }

    api_urls.forEach( async (api, index) => {
        if (!options.league || options.league === api.league) {
            const response = await fetch(api.url)
            const teams = await response.json()

            const extract_teams = teams.sports[0].leagues[0].teams

            const save_teams = extract_teams.map(indi_team => {
                return {
                    espn_id: `${api.league}_${indi_team.team.id}`,
                    location: indi_team.team.location,
                    name: indi_team.team.name,
                    nickname: indi_team.team.nickname,
                    abbreviation: indi_team.team.abbreviation,
                    displayName: indi_team.team.displayName,
                    shortDisplayName: indi_team.team.shortDisplayName,
                    color: indi_team.team.color,
                    alternateColor: indi_team.team.alternateColor,
                    logo: indi_team.team.logos[0].href
                }
            })

            Team.insertMany(save_teams)
                .then(createdTeams => {
                    console.log(`Successfully loaded ${createdTeams.length} teams for the ${api.league} league.`)
                })
                .catch(error => {
                    console.log(`There was an error while loading the ${api.league} league to the database. Error: ${error}`)
                })
        }
    })    
} 


// options object
//   dropTable: boolean
//   league: string (either ncaa_fbs or nfl... leave blank for both)

const getFreshTeams = (options) => {
    if (typeof options.dropTable === 'undefined') options.dropTable = false
    if (typeof options.league !== 'undefined') {
        if (options.league !== 'nfl' && options.league !== 'ncaa_fbs') {
            console.log("Error: Please specifiy a league as either 'nfl' or 'ncaa_fbs' or leave blank for both")
            return;
        }
    }
    
    console.log(`Search options:`, options)
    callTeams(options)
}

module.exports = getFreshTeams