const router = require('express').Router();
const words = require('../controllers/words');

router.get('/', words.getData);
router.post('/', words.createWordList);
router.patch('/', words.updateWordList);

module.exports = router;
