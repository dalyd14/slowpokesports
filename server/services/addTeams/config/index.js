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

module.exports = { api_urls }