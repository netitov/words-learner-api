const { celebrate, Joi } = require('celebrate');

const id = celebrate({
  params: {
    movieId: Joi.string().required().length(24).hex(),
  },
});

module.exports = id;
