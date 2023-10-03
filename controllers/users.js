const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const BadRequest = require('../errors/bad-request-err');
const DbConflict = require('../errors/db-conflict-err');
const AuthError = require('../errors/auth-err');

const SAULT_ROUNDS = 10;
const { JWT_SECRET = 'some-secret-key' } = process.env;

// Создание пользователя
const createUser = (req, res, next) => {
  const {
    email, password, ...body
  } = req.body;

  if (!email || !password) throw new BadRequest('логин или пароль отсутствует');

  bcrypt.hash(password, SAULT_ROUNDS, (error, hash) => {
    userModel.findOne({ email })
      .then((user) => {
        if (user) {
          throw new DbConflict('Такой пользователь уже существует');
        }

        return userModel.create({
          email, password: hash, ...body,
        })
          .then((newUser) => {
            const { password: hashPassword, ...userWithoutPassword } = newUser.toObject();
            res.status(201).send(userWithoutPassword);
          })
          .catch(next);
      })
      .catch(next);
  });
};

// Получить всех пользователей
const getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};
// Получить пользователя по id
const getUserById = (req, res, next) => {
  const { userId } = req.params;
  userModel
    .findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

// Обновить информацию о пользователе
const updateUser = (req, res, next) => {
  const userId = req.user._id;
  userModel
    .findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

// Вернуть информацию о пользователе
const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  userModel
    .findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// Обновить аватар
const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  userModel
    .findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .then((avatar) => {
      res.status(200).send(avatar);
    })
    .catch(next);
};

// Auth
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) throw new BadRequest('логин или пароль отсутствует');

  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new AuthError('Такого пользователя не существует');

      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) throw new AuthError('Логин или пароль неправильный');

          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          });

          return res.status(200).send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
  login,
};
