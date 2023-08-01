const router = require('express').Router();
const dictionary = require('../controllers/dictionary');

router.get('/', dictionary.getData);
router.patch('/', dictionary.updateDictionary);


module.exports = router;
