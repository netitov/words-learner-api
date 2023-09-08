const { CelebrateError } = require('celebrate');
const { errors } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).send({ serverError: err.message });
  }
  if (err instanceof CelebrateError) {
    const validationErrors = err.details?.get('body').details[0].message;
    if(errors.some((i) => validationErrors.includes(i))) {
      return res.status(400).send({ serverError: validationErrors });
    }
    return res.status(400).send({ serverError: 'Incorrect data entered. Please try again' });
  }
  res.status(500).send({ serverError: err.message });
  return next();
};

module.exports = errorHandler;
