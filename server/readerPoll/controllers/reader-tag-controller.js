const fetch = require('node-fetch')
const https = require('https')

const { Reader } = require('../../model')

const readerTagController = {
    async getMostRecentTag (ip, sessionkey) {
        const data = {
            sessionkey,
            maxrecords: 1
        }
        const agentOpts = new https.Agent({
            rejectUnauthorized: false,
        })
        const res = await fetch(`https://${ip}/rfrainapi.php/get_list_of_tags_history_status`,
            { 
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                agent: agentOpts
            })

        return res.json()
    },
    async getAllTagsFromCertainTime (ip, sessionkey, time) {
        const data = {
            sessionkey,
            startaccess: time
        }
        const agentOpts = new https.Agent({
            rejectUnauthorized: false,
        })
        const res = await fetch(`https://${ip}/rfrainapi.php/get_list_of_tags_history_status`,
            { 
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                agent: agentOpts
            })

        return res.json()
    },
    async updateLastTag (id, tag) {
        return new Promise( async (res, rej) => {
            try {
                await Reader.findByIdAndUpdate(
                    id,
                    { $set: { last: tag }}
                )
                res(true)
            } catch (e) {
                console.error(e)
                rej(e)
            }            
        })
    }
}

module.exports = readerTagController