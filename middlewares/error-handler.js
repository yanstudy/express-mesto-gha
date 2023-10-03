const mongoose = require('mongoose');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ message: err.message });
  } else if (err.code === 11000) {
    res.status(409).send({ message: err.message });
  } else {
    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }

  return next();
};
