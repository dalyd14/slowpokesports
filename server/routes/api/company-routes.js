const router = require('express').Router();
const {
    getAllCompanies,
    createNewCompany,
    showCompanyDashboard,
    getCompanyFilterData,
    updateCompany,
    deleteCompany
} = require('../../controllers/company-controller')

const { authMiddleware } = require('../../utils/auth')

router
    .route('/')
    .get(getAllCompanies)
    .post(createNewCompany)

router
    .route('/:id')
    .put(updateCompany)
    .delete(deleteCompany)

router
    .route('/dashboard')
    .get(authMiddleware, showCompanyDashboard)

router
    .route('/filters')
    .get(authMiddleware, getCompanyFilterData)

module.exports = router