const espn_api_dates_urls = [
    {
        url: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=1`,
        sport: 'football',
        league: 'nfl'
    },
    {
        url: `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1`,
        sport: 'football',
        league: 'ncaa_fbs'
    }
]

const espn_api_schedule_urls = [
    {
        url: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=1000`,
        sport: 'football',
        league: 'nfl'
    },
    {
        url: `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?limit=1000&groups=80`,
        sport: 'football',
        league: 'ncaa_fbs'
    }
]

module.exports = {
    espn_api_dates_urls,
    espn_api_schedule_urls
}