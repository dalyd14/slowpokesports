const db = require('../config/connection')

const { Reader } = require('../model')
const { getSessionKey, isSessionKeyValid, saveSessionKey } = require('./controllers/admin-controllers')
const { getMostRecentTag, getAllTagsFromCertainTime, updateLastTag } = require('./controllers/reader-tag-controller')

const runOperation = async () => {
    const foundReaders = await Reader.find({})

    //const pollingReaders = []

    foundReaders.forEach(async reader => {
        //const isPres = pollingReaders.some(pollReader => pollReader._id === reader._id)
        const sessionkey = await handleSessionKey(reader)
        // if (!isPres) {
        //     const lastTag = await handleLastTag(reader, sessionkey)
        //     pollingReaders.push({
        //         _id: reader._id,
        //         ip: reader.ip_address,
        //         sessionkey: sessionkey,
        //         lastTag: lastTag
        //     })
        // }

        const lastTag = await handleLastTag(reader, sessionkey)

        const recentTags = await getAllTagsFromCertainTime(reader.ip_address, sessionkey, lastTag.seen_unix)


        
    });
}

const handleLastTag = async (reader, sessionkey) => {
    return new Promise(async (res, rej) => {
        if (reader.last?.tagname) {
            res(reader.last)
        } else {
            const lastTagCall = await getMostRecentTag(reader.ip_address, sessionkey)
            if (!lastTagCall.success) {
                rej('Call to get last tag failed!')
            }
            const lastTag = {
                tagname: lastTagCall.results.history_results.tagnumb,
                status: lastTagCall.results.history_results.current_detectstat,
                seen_unix: lastTagCall.results.history_results.current_access_utc,
                subzone: lastTagCall.results.history_results.current_subzone
            }
            await Reader.findByIdAndUpdate(reader._id, { last: lastTag })
            res(lastTag)
        }
    })
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
                    Reader.findByIdAndUpdate(reader._id, { sessionkey: key1 })
                    res(key1)
                } else {
                    rej("unable to get session key")
                }
            }
        } else {
            const key2 = await newSesionKey(reader.ip_address, reader.emailRfrain, reader.passwordRfrain, reader.cnameRfrain)
            if (key2) {
                Reader.findByIdAndUpdate(reader._id, { sessionkey: key2 })
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
    }, 10 * 1000)
})