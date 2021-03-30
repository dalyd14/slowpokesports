const router = require('express').Router();
const {
    getTag,
    getTagHistory,
    getAllTagsAtCompany,
    getAllTagsAtReader,
    getAllTagsAtAntenna,
    getAllTagsAtMultipleReaders,
    getAllTagsAtMultipleAntennas,
    createNewTag,
    getTagsFromFilter,
    updateTag,
    deleteTag
} = require('../../controllers/tag-controller')

const { authMiddleware } = require('../../utils/auth')

router
    .route('/')
    .post(createNewTag)

router
    .route('/history/:sys_id')
    .get(getTagHistory)

router
    .route('/byCompany/:company')
    .get(getAllTagsAtCompany)

router
    .route('/byReader/:reader')
    .get(getAllTagsAtReader)

router
    .route('/byAntenna/:antenna')
    .get(getAllTagsAtAntenna)

router
    .route('/byReaders')
    .post(getAllTagsAtMultipleReaders)

router
    .route('/byAntennas')
    .post(getAllTagsAtMultipleAntennas)

router
    .route('/byFilters')
    .get(authMiddleware, getTagsFromFilter)

router
    .route('/:sys_id')
    .get(getTag)
    .put(updateTag)
    .delete(deleteTag)

module.exports = router