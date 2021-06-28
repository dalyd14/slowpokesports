const db = require('../config/connection')

const { Reader, Tag, TagHistory } = require('../model')
const { getSessionKey, isSessionKeyValid, saveSessionKey } = require('./controllers/admin-controllers')
const { getMostRecentTag, getAllTagsFromCertainTime } = require('./controllers/reader-tag-controller')

const runOperation = async () => {
    const foundReaders = await Reader.find({}).populate('antennas')

    foundReaders.forEach(async reader => {
        const sessionkey = await handleSessionKey(reader)

        const lastTag = await handleLastTag(reader, sessionkey)

        let searchTime = (parseFloat(lastTag.seen_unix) + .01).toString()

        let recentTags = await getAllTagsFromCertainTime(reader.ip_address, sessionkey, searchTime)
        
        if (recentTags.results?.history_results?.length) {
            recentTags = recentTags.results.history_results
            const isDone = await handleRecentTags(reader, recentTags)
        }       
        
    });
}

const handleRecentTags = async (reader, recentTags) => {
    return new Promise(async (res, rej) => {
        for (let i = recentTags.length - 1; i >= 0; i--) {
            const currTag = {
                sys_id: recentTags[i].tagnumb,
                tagname: recentTags[i].tagname,
                status: recentTags[i].current_detectstat,
                reader: reader._id,
                antenna: reader.antennas.find(ant => ant.sys_id === recentTags[i].subzone)._id,
                company: reader.company,
                seen_unix: recentTags[i].current_access_utc,
                current: true,
                SS: recentTags[i].SS
            }
            
            if (i === 0) {
                const lastTag = {
                    tagnumb: currTag.sys_id,
                    status: currTag.status,
                    seen_unix: currTag.seen_unix,
                    subzone: currTag.antenna
                }

                await updateReaderWithNewLastTag(reader, lastTag)
            }

            const isPres = await Tag.exists({ sys_id: currTag.sys_id })
            if (isPres) {
                console.log('HHHHHHHHHHHHHHHHHHHEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEE')
                await updateTag(currTag)
            } else {
                await createNewTag(currTag)
            }
        }
        res(true)
    })
}

const updateReaderWithNewLastTag = async (reader, lastTag) => {
    return new Promise(async (res, rej) => {
        const newReader = await Reader.findByIdAndUpdate(reader._id, { last: lastTag })
        res(newReader)
    })
}

const createNewTag = async (tagData) => {
    return new Promise(async (res, rej) => {
        const newTag = await Tag.create(tagData)
        res(newTag)
    })
}

const updateTag = async (tagData) => {
    return new Promise(async (res, rej) => {
        const updatedTag = await Tag.findOneAndUpdate(
            { sys_id: tagData.sys_id },
            tagData,
            {new: false}
        ).lean()

        updatedTag.current = false

        const { _id, __v, ...keep } = updatedTag
        const newHistoryTag = await TagHistory.create(keep)
        res(newHistoryTag)
    })
}

const handleLastTag = async (reader, sessionkey) => {
    return new Promise(async (res, rej) => {
        if (reader.last?.tagnumb) {
            res(reader.last)
        } else {
            const lastTagCall = await getMostRecentTag(reader.ip_address, sessionkey)
            if (!lastTagCall.success) {
                rej('Call to get last tag failed!')
            }

            if (!lastTagCall.results?.history_results?.length) {

                const time = Math.floor(new Date().getTime() / 1000)

                const lastTag = {
                    tagnumb: 'default',
                    status: 'default',
                    seen_unix: time,
                    subzone: 'default'
                }
                await Reader.findByIdAndUpdate(reader._id, { last: lastTag })
                res(lastTag)
            } else {
                const lastTag = {
                    tagnumb: lastTagCall.results.history_results[0].tagnumb,
                    status: lastTagCall.results.history_results[0].current_detectstat,
                    seen_unix: lastTagCall.results.history_results[0].current_access_utc,
                    subzone: lastTagCall.results.history_results[0].current_subzone
                }
                await Reader.findByIdAndUpdate(reader._id, { last: lastTag })
                res(lastTag)                
            }
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
        const results = await getSessionKey(ip, email, password, cname)
        if (!results) {
            return
        }
        const isSuccess = await saveSessionKey(ip, results.results.sessionkey)
        res(isSuccess ? results.results.sessionkey : false)        
    })
}

db.once('open', () => {
    setInterval(function() {
        runOperation()
    }, 20 * 1000)
})