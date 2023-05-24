const router = require('express').Router();
const words = require('../controllers/words');

router.get('/words', words.getData);
router.post('/words', words.createWordList);
router.patch('/words', words.updateWordList);

module.exports = router;
