const db = require('./config/connection')

const { Tag } = require('./model')


db.once('open', async () => {
    const newData = {}
    newData.tagname = "changed the description"
    const updatedTag = await Tag.findOneAndUpdate(
        { sys_id: '00-00-00-00-00-00-00-00-00-00-02-29' },
        newData,
        { new: false }
    ).lean()

    if (updatedTag) {
        console.log("done")
    } else {
        console.log("couldnt find it")
    }
})