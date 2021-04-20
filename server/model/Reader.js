const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const LastReadTagSchema = new Schema({
    tagnumb: { type: String, required: true },
    status: { type: String, required: true, enum: ['PRES', 'MISS'] },
    seen_unix: { type: Number, required: true },
    subzone: { type: String, required: true }
})

const ReaderModelSchema = new Schema({
    sys_id: { type: String, required:  true, unique: true },
    display_name: { type: String, required:  true },
    ip_address: { type: String, required:  true, unique: true },
    sessionkey: { type: String },
    emailRfrain: { type: String, required:  true, unique: true },
    passwordRfrain: { type: String, required:  true, unique: true },
    cnameRfrain: { type: String, required:  true, unique: true },
    last: { type: LastReadTagSchema, required: false},
    location_description: { type: String, required:  true },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    antennas: [{ type: Schema.Types.ObjectId, ref: "Antenna" }]
});

const Reader = mongoose.model('Reader', ReaderModelSchema, "Reader")

module.exports = Reader;