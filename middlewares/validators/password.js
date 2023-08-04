const { celebrate, Segments, Joi } = require('celebrate');
const { passwordLengthMin } = require('../../utils/constants');

const password = celebrate({
  [Segments.BODY]: {
    password: Joi.string().required().min(passwordLengthMin).messages({
      'string.min': `Password must be at least ${passwordLengthMin} characters long`,
      'string.empty': 'Password is required',
    }),
  },
});

module.exports = password;
