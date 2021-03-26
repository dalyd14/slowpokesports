const { Reader, Company, Antenna } = require('../../model')

const antennaController = {
    async getAllAntennas (req, res) {
        const foundAntennas = await Antenna.find()
        res.json(foundAntennas)
    },

    async getAllAntennasAtCompany ({ params }, res) {
        const company = await Company.findOne({ sys_id: params.sys_id })
            .populate({
                path: "readers",
                populate: {
                    path: "antennas"
                }
            })
            .lean()
        
        const antennas = company.readers.reduce((acc, currentVal) => {
            acc.push(currentVal.antennas)
        }, [])

        res.json(antennas)
    },
    async createAntenna ({ body }, res) {
        const sys_id = body.display_name.trim().split(" ").join("_").toLowerCase()

        const newAntenna = new Antenna({
            sys_id,
            display_name: body.display_name.trim(),
            location_description: body.location_description,
            company: body.company,
            reader: body.reader
        })
    
        const savedAntenna = await newAntenna.save()
    
        const updatedReader = await Reader.findByIdAndUpdate(
            body.reader,
            { $push: { "antennas": savedAntenna._id } }   
        )
    
        res.json(savedAntenna)
    },
    async updateAntenna ({ params, body }, res) {
        const updatedAntenna = await Antenna.findOneAndUpdate(
            {sys_id: params.sys_id},
            body,
            {new: true}
        )
    
        res.json(updatedAntenna)
    },
    async deleteAntenna ({ params }, res) {
        const removedAntenna = await Antenna.findOneAndDelete({
            sys_id: params.sys_id
        })
    
        const updatedReader = await Reader.findByIdAndUpdate(
            removedAntenna.reader,
            { $pull: { "antennas": removedAntenna._id } }   
        )
    
        res.json(removedAntenna)
    }
}

module.exports = antennaController