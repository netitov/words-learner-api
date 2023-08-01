const { celebrate, Joi } = require('celebrate');

const updateUser = celebrate({
  body: {
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  },
});

module.exports = updateUser;
