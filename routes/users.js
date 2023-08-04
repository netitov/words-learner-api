const router = require('express').Router();
const {
  updateUser, getUserMe, sendResetLink
} = require('../controllers/users');
const updateUserValidator = require('../middlewares/validators/updateUser');
const authMiddleware = require('../middlewares/auth');
const emailValidator = require('../middlewares/validators/email');

router.get('/me', authMiddleware, getUserMe);
router.patch('/me', updateUserValidator, updateUser);
router.post('/password-reset', emailValidator, sendResetLink);

module.exports = router;
