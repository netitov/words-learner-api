const router = require('express').Router();
const apiCalls = require('../controllers/apicalls');

router.get('/', apiCalls.getData);
router.patch('/', apiCalls.updateData);

module.exports = router;
