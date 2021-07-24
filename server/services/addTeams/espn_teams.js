const fetch = require('node-fetch');

const { Team } = require('../../model')

try {
    Team.collection.drop()
    console.log("Team collection drop successful")
} catch (e) {
    console.log("Team collection doesn't already exists or there was an error dropping it.")
}

const api_urls = [
    {
        url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=900',
        sport: 'football',
        league: 'nfl'
    },
    {
        url: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=900&groups=80',
        sport: 'football',
        league: 'ncaa_fbs'
    }
]

api_urls.forEach( async api => {
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
})