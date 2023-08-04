const router = require('express').Router();
const {
  updateUser, getUserMe, sendResetLink, updatePassword
} = require('../controllers/users');
const updateUserValidator = require('../middlewares/validators/updateUser');
const authMiddleware = require('../middlewares/auth');
const emailValidator = require('../middlewares/validators/email');
const passwordValidator = require('../middlewares/validators/password');

router.get('/me', authMiddleware, getUserMe);
router.patch('/me', updateUserValidator, updateUser);
router.post('/password-reset', emailValidator, sendResetLink);
router.post('/password-reset/:userId/:token', passwordValidator, updatePassword);

module.exports = router;
