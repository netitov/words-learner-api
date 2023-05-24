const router = require('express').Router();
const apiCalls = require('../controllers/apicalls');

router.get('/apicalls', apiCalls.getData);
router.patch('/apicalls', apiCalls.updateData);

module.exports = router;
