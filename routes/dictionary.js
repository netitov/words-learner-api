const router = require('express').Router();
const dictionary = require('../controllers/dictionary');

router.get('/dictionary', dictionary.getData);
router.patch('/dictionary', dictionary.updateDictionary);


module.exports = router;
