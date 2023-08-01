const { celebrate, Segments, Joi } = require('celebrate');

const register = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required',
    }),
    userName: Joi.string().min(2).max(30).messages({
      'string.min': 'User name must be at least 2 characters long',
      'string.max': 'User name must be at most 30 characters long',
      'string.empty': 'User name is required',
    }),
    password: Joi.string().required().min(7).messages({
      'string.min': 'Password must be at least 7 characters long',
      'string.empty': 'Password is required',
    }),
  }),
});


module.exports = register;
