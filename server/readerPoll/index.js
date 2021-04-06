const db = require('../config/connection')

const { Reader } = require('../model')
const { getSessionKey, isSessionKeyValid, saveSessionKey } = require('./controllers/admin-controllers')

const runOperation = async () => {
    const foundReaders = await Reader.find({})

    foundReaders.forEach(async reader => {
        const sessionkey = await handleSessionKey(reader)
    });
}

const handleLastTag = async reader => {
    if (reader.last) {
        
    }
}

const handleSessionKey = async (reader) => {
    return new Promise(async (res, rej) => {
        if (reader.sessionkey) {
            const isValid = await isSessionKeyValid(reader.ip_address, reader.sessionkey)
            if (isValid) {
                res(reader.sessionkey)
            } else {
                const key1 = await newSesionKey(reader.ip_address, reader.emailRfrain, reader.passwordRfrain, reader.cnameRfrain)
                if (key1) {
                    res(key1)
                } else {
                    rej("unable to get session key")
                }
            }
        } else {
            const key2 = await newSesionKey(reader.ip_address, reader.emailRfrain, reader.passwordRfrain, reader.cnameRfrain)
            if (key2) {
                res(key2)
            }
            else {
                rej("unable to get session key")
            }
        }        
    })

}
                                                                           
const newSesionKey = async (ip, email, password, cname) => {
    return new Promise ( async (res, rej) => {
        const { results } = await getSessionKey(ip, email, password, cname)
        const isSuccess = await saveSessionKey(ip, results.sessionkey)
        res(isSuccess ? results.sessionkey : false)        
    })
}

db.once('open', () => {
    setInterval(function() {
        runOperation()
    }, 3 * 1000)
})