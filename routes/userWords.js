const router = require('express').Router();
const {
  getData, createData, deleteData
} = require('../controllers/userWords');

const authMiddleware = require('../middlewares/auth');
const userWordsValidator = require('../middlewares/validators/userWords');

router.get('/', authMiddleware, getData);
router.post('/', authMiddleware, userWordsValidator, createData);
router.post('/:word', authMiddleware, deleteData);

module.exports = router;
