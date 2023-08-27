const router = require('express').Router();
const wordData = require('../controllers/wordData');
const uploadFile = require('../middlewares/uploadFile');

router.post('/word-data', uploadFile, wordData.createData);
router.patch('/word-data', wordData.addValidity);
router.get('/word-data/:words', wordData.getData);
router.get('/random-words', wordData.getFilteredData);

router.post('/word-data-quiz', wordData.getQuizOptions);
//router.patch('/worddata', wordData.updateData);

module.exports = router;
