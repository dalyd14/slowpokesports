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
    updateTag,
    deleteTag
} = require('../../controllers/tag-controller')

router
    .route('/')
    .post(createNewTag)

router
    .route('/:sys_id')
    .get(getTag)
    .put(updateTag)
    .delete(deleteTag)

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

module.exports = router