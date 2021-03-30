const { Company, Tag } = require('../model')

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

    async showCompanyDashboard (req, res) {
        const company = await Company.findById(req.user.company._id)
            .populate({
                path: 'readers',
                populate: {
                    path: 'antennas'
                }
            })
            .lean()

        const result = {
            company: {
                sys_id: company.sys_id,
                display_name: company.display_name
            },
            readers: []
        }

        Promise.all(await company.readers.map(async reader => {
            reader.tagCountPres = await Tag.countDocuments({ reader: reader._id, status: 'PRES', current: true }),
            reader.tagCountMiss = await Tag.countDocuments({ reader: reader._id, status: 'MISS', current: true })
            return Promise.all(
                reader.antennas.map(async antenna => {
                    return {
                        ...antenna,
                        tagCountPres: await Tag.countDocuments({ antenna: antenna._id, status: 'PRES', current: true }),
                        tagCountMiss: await Tag.countDocuments({ antenna: antenna._id, status: 'MISS', current: true })
                    }
                })
            ).then(someData => {
                reader.antennas = someData
                result.readers.push(reader)
            })
        })).then(() => {
            res.json(result)
        })
    },

    async getCompanyFilterData (req, res) {
        const foundCompany = await Company.findById(req.user.company._id)
            .populate({
                path: 'readers',
                model: 'Reader',
                populate: {
                    path: 'antennas',
                    model: 'Antenna',
                    populate: {
                        path: 'reader',
                        model: 'Reader'
                    }
                }
            })
            .lean()
    
        const company = { 
            _id: foundCompany._id,
            display_name: foundCompany.display_name,
            sys_id: foundCompany.sys_id,
            readers: foundCompany.readers
                .map(reader => {
                    let { antennas, __v, company, ...rest } =  reader
                    return rest
                }),
            antennas: foundCompany.readers
                .map(reader => reader.antennas)
                .reduce((acc, curVal) => {
                    return acc.concat(curVal)
                }, [])
        }

        res.json(company)
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