const fetch = require('node-fetch')
const https = require('https')

const readerTagController = {
    async getReaderRecentTags (ip, sessionkey) {
        const data = {
            sessionkey
        }
        const agentOpts = new https.Agent({
            rejectUnauthorized: false,
        })
        const res = await fetch(`https://${ip}/rfrainapi.php/get_latest_tags_history`,
            { 
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                agent: agentOpts
            })

        return res.json()
    }
}

module.exports = readerTagController