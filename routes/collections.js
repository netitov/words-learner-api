const router = require('express').Router();
const {
  getData, createData, deleteData, updateData
} = require('../controllers/collections');

const authMiddleware = require('../middlewares/auth');
const collectionValidator = require('../middlewares/validators/collection');

router.get('/', authMiddleware, getData);
router.post('/', authMiddleware, collectionValidator, createData);
router.delete('/:collectionId', authMiddleware, deleteData);
router.patch('/:collectionId', authMiddleware, updateData);

module.exports = router;
