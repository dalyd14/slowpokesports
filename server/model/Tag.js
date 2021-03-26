const mongoose = require('mongoose')
// const mongoose = require('../config/connection')

const Schema = mongoose.Schema;

const TagModelSchema = new Schema({
    sys_id: { type: String, required: true },
    tagname: { type: String, required: true },
    status: { type: String, required: true, enum: ['PRES', 'MISS'] },
    reader: { type: Schema.Types.ObjectId, ref: "Reader" },
    antenna: { type: Schema.Types.ObjectId, ref: "Antenna" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    seen_unix: { type: Number, required: true },
    current: { type: Boolean, required: true },
    SS: { type: Number, required: true }
});

const Tag = mongoose.model('Tag', TagModelSchema, "Tag")
const TagHistory = mongoose.model('TagHistory', TagModelSchema, "TagHistory")

module.exports = { Tag, TagHistory };