const router = require('express').Router();
const freqs = require('../controllers/freqs');

router.get('/:words', freqs.getData);
router.post('/', freqs.createData);

module.exports = router;
