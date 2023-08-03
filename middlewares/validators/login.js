const { celebrate, Joi } = require('celebrate');

const login = celebrate({
  body: {
    email: Joi.string().required().email().messages({
      'string.email': 'Invalid email',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
    }),
  },
});

module.exports = login;
