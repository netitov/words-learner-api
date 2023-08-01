const router = require('express').Router();
const sources = require('../controllers/sources');

router.get('/', sources.getData);
router.patch('/', sources.updateData);
router.post('/', sources.createDataList);

module.exports = router;
