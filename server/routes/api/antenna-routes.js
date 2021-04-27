const router = require('express').Router();
const {
    getAllAntennas,
    getAllAntennasAtCompany,
    createAntenna,
    updateAntenna,
    deleteAntenna
} = require('../../controllers/antenna-controller')

router
    .route('/')
    .get(getAllAntennas)
    .post(createAntenna)

router
    .route('/byCompany/:sys_id')
    .get(getAllAntennasAtCompany)

router
    .route('/:_id')
    .put(updateAntenna)
    .delete(deleteAntenna)

module.exports = router