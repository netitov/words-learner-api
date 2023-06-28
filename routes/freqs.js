const router = require('express').Router();
const freqs = require('../controllers/freqs');

router.get('/freq/:words', freqs.getData);
router.post('/freq', freqs.createData);

module.exports = router;
