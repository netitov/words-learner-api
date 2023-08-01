const router = require('express').Router();
const languages = require('../controllers/languages');

router.get('/', languages.getData);
router.patch('/', languages.updateLanguages);


module.exports = router;
