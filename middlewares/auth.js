const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AuthError('Необходима регистрация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return next(new AuthError('Необходима регистрация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
