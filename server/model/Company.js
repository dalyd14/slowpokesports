const mongoose = require('mongoose')
// const mongoose = require('../config/connection')

const Schema = mongoose.Schema;

const CompanyModelSchema = new Schema({
    sys_id: { type: String, unique: true, required: true },
    display_name: { type: String, required:  true },
    readers: [{ type: Schema.Types.ObjectId, ref: "Reader" }]
});

const Company = mongoose.model("Company", CompanyModelSchema, "Company")

module.exports = Company;