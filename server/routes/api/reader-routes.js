const router = require('express').Router();
const {
    getAllReaders,
    getAllReadersAtCompany,
    createReader,
    updateReader,
    deleteReader
} = require('../../controllers/reader-controller')

router
    .route('/')
    .get(getAllReaders)
    .post(createReader)

router
    .route('/:_id')
    .put(updateReader)
    .delete(deleteReader)

router
    .route('/byCompany/:sys_id')
    .get(getAllReadersAtCompany)

module.exports = router