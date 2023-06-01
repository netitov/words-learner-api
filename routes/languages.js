const router = require('express').Router();
const languages = require('../controllers/languages');

router.get('/languages', languages.getData);
router.patch('/languages', languages.updateLanguages);


module.exports = router;
