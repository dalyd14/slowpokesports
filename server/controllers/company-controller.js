const { Company } = require('../model')

const companyController = {
    async getAllCompanies (req, res) {
        const foundCompanies = await Company.find().populate('readers')
        res.json(foundCompanies)
    },

    async createNewCompany ({ body }, res) {
        const sys_id = body.display_name.trim().split(" ").join("_").toLowerCase()
        const newCompany = new Company({
            sys_id,
            display_name: display_name.trim(),
            readers: []
        })
    
        const savedCompany = await newCompany.save()
        res.json(savedCompany)
    },

    async updateCompany ({ params, body }, res) {
        const updatedCompany = await Company.findByIdAndUpdate(params.id, body)

        res.json(updatedCompany)
    },

    async deleteCompany ({ params }, res) {
        // need more work on deleting companies
        const deletedCompany = await Company.findByIdAndDelete(params.id)

        res.json(deletedCompany)
    }
}

module.exports = companyController