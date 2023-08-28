const router = require('express').Router();
const {
  getData, createData, deleteData
} = require('../controllers/testResult');

const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, getData);
router.post('/', authMiddleware, createData);
router.delete('/:testId', authMiddleware, deleteData);

module.exports = router;
