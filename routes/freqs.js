const router = require('express').Router();
const freqs = require('../controllers/freqs');

router.get('/freq/:word', freqs.getData);
router.post('/freq', freqs.createData);

module.exports = router;
