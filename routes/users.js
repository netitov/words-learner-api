const router = require('express').Router();
const {
  updateUser, getUserMe,
} = require('../controllers/users');
const updateUserValidator = require('../middlewares/validators/updateUser');
const authMiddleware = require('../middlewares/auth');

router.get('/me', authMiddleware, getUserMe);
router.patch('/me', updateUserValidator, updateUser);

module.exports = router;
