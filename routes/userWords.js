const router = require('express').Router();
const {
  getData, createData, deleteData, updateWordSource, deleteArrayData
} = require('../controllers/userWords');

const authMiddleware = require('../middlewares/auth');
const userWordsValidator = require('../middlewares/validators/userWords');

router.get('/', authMiddleware, getData);
router.post('/', authMiddleware, userWordsValidator, createData);
router.delete('/:word', authMiddleware, deleteData);
router.patch('/', authMiddleware, updateWordSource);
router.delete('/', authMiddleware, deleteArrayData);

module.exports = router;
