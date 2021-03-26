const router = require('express').Router();
const {
    getAllCompanies,
    createNewCompany,
    updateCompany,
    deleteCompany
} = require('../../controllers/company-controller')

router
    .route('/')
    .get(getAllCompanies)
    .post(createNewCompany)

router
    .route('/:id')
    .put(updateCompany)
    .delete(deleteCompany)

module.exports = router