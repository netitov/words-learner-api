const router = require('express').Router();
const { errors, isCelebrateError } = require('celebrate');
const errorHandler = require('../middlewares/errorHandler');

const { login, createUser } = require('../controllers/users');
const registerValidator = require('../middlewares/validators/register');
const loginValidator = require('../middlewares/validators/login');

router.post('/login', loginValidator, login);
router.post('/signup', registerValidator, createUser);

module.exports = router;
