const { celebrate, Segments, Joi } = require('celebrate');
const { userNameLengthMin, userNameLengthMax, passwordLengthMin } = require('../../utils/constants');

const register = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Invalid email',
      'string.empty': 'Email is required',
    }),
    userName: Joi.string().min(userNameLengthMin).max(userNameLengthMax).messages({
      'string.min': `User name must be at least ${userNameLengthMin} characters long`,
      'string.max': `User name must be at most ${userNameLengthMax} characters long`,
      'string.empty': 'User name is required',
    }),
    password: Joi.string().required().min(passwordLengthMin).messages({
      'string.min': `Password must be at least ${passwordLengthMin} characters long`,
      'string.empty': 'Password is required',
    }),
  }),
});


module.exports = register;
