const { Tag, TagHistory } = require('../model')

const tagController = {
    async getTag({ params }, res) {
        const foundTags = await Tag.findOne({ sys_id: params.sys_id })
            .populate('reader')
            .populate('antenna')
        res.json(foundTags)        
    },
    async getTagHistory({ params }, res) {
        const foundTags = await TagHistory.find({ sys_id: params.sys_id })
            .sort({ seen_unix: 'desc' })
            .populate('reader')
            .populate('antenna')
        res.json(foundTags)
    },
    async getAllTagsAtCompany ({ params }, res) {
        const foundTags = await Tag.find({ company: params.company })
        res.json(foundTags)        
    },
    async getAllTagsAtReader ({ params }, res) {
        const foundTags = await Tag.find({ reader: params.reader })
        res.json(foundTags)
    },
    async getAllTagsAtAntenna ({ params }, res) {
        const foundTags = await Tag.find({ antenna: params.antenna })
        res.json(foundTags)
    },
    async getAllTagsAtMultipleReaders ({ body }, res) {
        // This is a route for searching for tags from multiple readers
        // it is a post route because the req.body needed to be accessed while also returning content
        const foundTags = await Tag.find({
            reader: {
                $in: body.readers
            }
        })
        res.json(foundTags)        
    },
    async getAllTagsAtMultipleAntennas ({ body }, res) {
        // This is a route for searching for tags from multiple antennas
        // it is a post route because the req.body needed to be accessed while also returning content
        const foundTags = await Tag.find({
            antenna: {
                $in: body.antennas
            }
        })
        res.json(foundTags)        
    },
    async createNewTag({ body }, res) {
        // This route adds a new tag to the current database
        // note: just because it is in current, does not mean it is present
        //       it just means that this is the most recent record of the tag
        //       Therefore, since this is the newest record, it will be in the current
        const newTag = new Tag({
            sys_id: body.sys_id,
            tagname: body.tagname,
            status: body.status,
            reader: body.reader,
            antenna: body.antenna,
            company: body.company,
            seen_unix: body.seen_unix,
            current: true,
            SS: body.SS
        })

        const savedTag = await newTag.save()
        res.json(savedTag)        
    },
    async getTagsFromFilter ({ user, body }, res) {
        console.log("HEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEE")
        const filters = {}

        if (!body || !Object.keys(body).length) {    
            filters.company = user.company._id
        }

        if ('reader' in body) {
            if (body.reader.length) {
                filters.reader = {
                    $in: body.reader
                }                
            }
        }

        if ('antenna' in body) {
            if (body.antenna.length) {
                filters.antenna = {
                    $in: body.antenna
                }                
            }
        }

        if ('status' in body) {
            if (body.status) {
                filters.status = body.status
            }
        }
        
        console.log(filters)
        const tags = await Tag.find(filters)
            .populate('reader')
            .populate('antenna')
            .lean()
    
        res.json(tags)
    },
    async updateTag({ params, body }, res) {
        const updatedTag = await Tag.findOneAndUpdate(
            { sys_id: params.sys_id },
            body,
            {new: false}
        ).lean()

        updatedTag.current = false;

        const { _id, __v, ...keep } = updatedTag

        const newHistoryTag = new TagHistory(keep)
        const savedHistoryTag = await newHistoryTag.save()

        res.json(savedHistoryTag)            
    },
    async deleteTag({ params }, res) {
        const deletedTags = Tag.deleteMany({ sys_id: params.sys_id })

        res.json(deletedTags)        
    }
}

module.exports = tagController