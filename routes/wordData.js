const router = require('express').Router();
const wordData = require('../controllers/wordData');
const uploadFile = require('../middlewares/uploadFile');

router.post('/worddata', uploadFile, wordData.createData);
router.get('/worddata/:words', wordData.getData);
//router.patch('/worddata', wordData.updateData);

module.exports = router;
