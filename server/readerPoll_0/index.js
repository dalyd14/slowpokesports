const db = require('../config/connection')

const { Reader, Tag, TagHistory } = require('../model')
const { getSessionKey, isSessionKeyValid, saveSessionKey } = require('./controllers/admin-controllers')
const { getReaderRecentTags } = require('./controllers/reader-tag-controller')

const runOperation = async () => {
    console.log(`\nStart Polling for Updates...\n`)
    const foundReaders = await Reader.find({}).populate('antennas')

    foundReaders.forEach(async reader => {
        try {
            const sessionkey = await handleSessionKey(reader)

            let recentTags = await getReaderRecentTags(reader.ip_address, sessionkey)
            
            if (!recentTags.success) {
                console.error(`Reader: ${reader.display_name} | IP: ${reader.ip_address} || There was an error while making recent tag call`)
            } else {
                if (recentTags.results.taglist.length > 0) {
                    console.log(`Reader: ${reader.display_name} | IP: ${reader.ip_address} || There were ${recentTags.results.taglist.length} new update(s) found`)
                    recentTags = recentTags.results.taglist
                    const isDone = await handleRecentTags(reader, recentTags)
                } else {
                    console.log(`Reader: ${reader.display_name} | IP: ${reader.ip_address} || No new updates found`)
                }                
            }            
        } catch (e) {
            console.log(e)
        }
    });

    // console.log('Polling Complete')
}

const handleRecentTags = async (reader, recentTags) => {
    return new Promise(async (res, rej) => {
        for (let i = recentTags.length - 1; i >= 0; i--) {
            const currTag = {
                sys_id: recentTags[i].tagnumb,
                tagname: recentTags[i].tagname,
                status: recentTags[i].detectstat,
                reader: reader._id,
                company: reader.company,
                seen_unix: recentTags[i].access_utc,
                current: true,
                SS: recentTags[i].SS
            }

            if (recentTags[i].subzone) {
                currTag.antenna = reader.antennas.find(ant => ant.sys_id === recentTags[i].subzone)._id
            }

            const isPres = await Tag.exists({ sys_id: currTag.sys_id })
            if (isPres) {
                await updateTag(currTag)
            } else {
                await createNewTag(currTag)
            }
        }
        res(true)
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

const handleSessionKey = async (reader) => {
    return new Promise(async (res, rej) => {
        if (reader.sessionkey) {
            const isValid = await isSessionKeyValid(reader.ip_address, reader.sessionkey)
            if (isValid) {
                res(reader.sessionkey)
            } else {
                let key1
                try {
                    key1 = await newSesionKey(reader.ip_address, reader.emailRfrain, reader.passwordRfrain, reader.cnameRfrain)
                } catch (e) {
                    console.log(e)
                }
                if (key1) {
                    Reader.findByIdAndUpdate(reader._id, { sessionkey: key1 })
                    res(key1)
                }
            }
        } else {
            let key2
            try {
                key2 = await newSesionKey(reader.ip_address, reader.emailRfrain, reader.passwordRfrain, reader.cnameRfrain, reader.display_name)
            } catch (e) {
                console.log(e)
            }
            if (key2) {
                Reader.findByIdAndUpdate(reader._id, { sessionkey: key2 })
                res(key2)
            }
        }        
    })

}
                                                                           
const newSesionKey = async (ip, email, password, cname, readerName) => {
    return new Promise ( async (res, rej) => {
        const results = await getSessionKey(ip, email, password, cname)
        if (!results) {
            rej(`Reader: ${readerName} | IP: ${ip} || Unable to get session key`)
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