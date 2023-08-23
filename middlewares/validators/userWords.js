const { celebrate, Joi, Segments } = require('celebrate');

const wordSchema = Joi.object({
  word: Joi.string().required(),
  translation: Joi.string().required(),
  translationLang: Joi.string().required(),
  source: Joi.array()
});

const arrayOfWordsSchema = Joi.array().items(wordSchema);

const userWords = celebrate({ [Segments.BODY]: arrayOfWordsSchema });

module.exports = userWords;
