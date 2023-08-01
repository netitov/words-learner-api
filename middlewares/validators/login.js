const { celebrate, Joi } = require('celebrate');

const login = celebrate({
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required().min(7),
  },
});

module.exports = login;
