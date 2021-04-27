const { Reader, Company, Antenna } = require('../model')

const readerController = {
    async getAllReaders (req, res) {
        console.log(Reader.db.name)
        const foundReaders = await Reader.find().populate("company", "-readers -_id -__v")
        res.json(foundReaders)
    },
    async getAllReadersAtCompany ({ params }, res) {
        const company = await Company.findOne({ sys_id: params.sys_id })
            .populate('readers')
        res.json(company.readers)
    },
    async createReader ({ body }, res) {

        const newReader = new Reader({
            sys_id: body.sys_id,
            display_name: body.display_name.trim(),
            ip_address: body.ip_address,
            location_description: body.location_description,
            cnameRfrain: body.cnameRfrain,
            emailRfrain: body.emailRfrain,
            passwordRfrain: body.passwordRfrain,
            sessionkey: body.sessionkey,
            last: body.last,
            company: body.company,
            antennas: body.antennas
        })
    
        let savedReader = await newReader.save()
        savedReader = await savedReader.populate('antennas').execPopulate()
    
        const updatedCompany = await Company.findByIdAndUpdate(
            body.company,
            { $push: { "readers": savedReader._id } }   
        )
    
        res.json(savedReader)
    },
    async updateReader ({ params, body }, res) {
        const updatedReader = await Reader.findOneAndUpdate(
            {_id: params._id},
            body,
            {new: true}
        )
    
        res.json(updatedReader)
    },
    async deleteReader ({ params }, res) {
        const removedReader = await Reader.findOneAndDelete({
            _id: params._id
        })
    
        const updatedCompany = await Company.findByIdAndUpdate(
            removedReader.company,
            { $pull: { "readers": removedReader._id } }   
        )
        
        const removedAntennas = await Antenna.deleteMany({
            _id: {
                $in: removedReader.antennas
            }
        })
    
        res.json(removedReader)
    }
}

module.exports = readerController