const router = require('express').Router();
const sources = require('../controllers/sources');

router.get('/sources', sources.getData);
router.patch('/sources', sources.updateData);
router.post('/sources', sources.createDataList);

module.exports = router;
