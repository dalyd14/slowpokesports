const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const AntennaModelSchema = new Schema({
    sys_id: { type: String, required: true },
    display_name: { type: String, required:  true },
    location_description: { type: String, required:  true },
    reader: { type: Schema.Types.ObjectId, ref: "Reader" },
    company: { type: Schema.Types.ObjectId, ref: "Company" }
});

const Antenna = mongoose.model('Antenna', AntennaModelSchema, "Antenna")

module.exports = Antenna;