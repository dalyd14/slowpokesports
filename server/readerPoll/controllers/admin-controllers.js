const fetch = require('node-fetch')
const https = require('https')

const { Reader } = require('../../model')

const adminController = {
    async getSessionKey (ip, email, password, cname) {
        const data = { email, password, cname }
        data.email = Buffer.from(email).toString('base64')
        data.password = Buffer.from(password).toString('base64')

        try {
            const agentOpts = new https.Agent({
                rejectUnauthorized: false,
            })
            const res = await fetch(`https://${ip}/rfrainapi.php/get_sessionkey`,
                { 
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' },
                    agent: agentOpts
                })

            return res.json()
        } catch (e) {
            return false
        }
    },
    async isSessionKeyValid (ip, sessionkey) {
        return new Promise( async (resolve, rej) => {
            try {
                const agentOpts = new https.Agent({
                    rejectUnauthorized: false,
                })
                const res = await fetch(`https://${ip}/rfrainapi.php/is_sessionkey_valid`,
                    { 
                        method: 'POST',
                        body: JSON.stringify({ sessionkey }),
                        headers: { 'Content-Type': 'application/json' },
                        agent: agentOpts
                    })

                const { results } = await res.json()
                resolve( results.is_valid )                
            } catch (e) {
                resolve(false)
            }
        })
    },
    async saveSessionKey (ip, sessionkey) {
        return new Promise( async (res, rej) => {
            try {
                await Reader.findOneAndUpdate(
                    { ip_address: ip},
                    { $set: { sessionkey }}
                )
                res(true)
            } catch (e) {
                console.error(e)
                rej(e)
            }            
        })
    }
}

module.exports = adminController