const router = require('express').Router();
const {
    getAllCompanies,
    createNewCompany,
    getOneCompany,
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
    .route('/getOne')
    .get(authMiddleware, getOneCompany)
    
router
    .route('/dashboard')
    .get(authMiddleware, showCompanyDashboard)

router
    .route('/filters')
    .get(authMiddleware, getCompanyFilterData)

router
    .route('/:id')
    .put(updateCompany)
    .delete(deleteCompany)

module.exports = router