const mongoose = require('mongoose')
// const mongoose = require('../config/connection')

const Schema = mongoose.Schema;

const ReaderModelSchema = new Schema({
    sys_id: { type: String, required:  true, unique: true },
    display_name: { type: String, required:  true },
    ip_address: { type: String, required:  true, unique: true },
    location_description: { type: String, required:  true },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    antennas: [{ type: Schema.Types.ObjectId, ref: "Antenna" }]
});

const Reader = mongoose.model('Reader', ReaderModelSchema, "Reader")

module.exports = Reader;