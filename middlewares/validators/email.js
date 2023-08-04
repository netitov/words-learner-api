const { celebrate, Segments, Joi } = require('celebrate');

const email = celebrate({
  [Segments.BODY]: {
    email: Joi.string().required().email().messages({
      'string.email': 'Invalid email',
      'string.empty': 'Email is required',
    }),
  },
});

module.exports = email;
