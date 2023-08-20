const { celebrate, Segments, Joi } = require('celebrate');

const collectionSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    collectionName: Joi.string().required(),
    style: Joi.object().required(),
    default: Joi.boolean().required(),
  }),
});


module.exports = collectionSchema;
