const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const VALIDATIONERROR_CODE = 400;
const SERVERERROR_CODE = 500;
const SAULT_ROUNDS = 10;
const { JWT_SECRET = 'some-secret-key' } = process.env;

// Создание пользователя
const createUser = (req, res) => {
  console.log('kjh')
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!email || !password) res.status(VALIDATIONERROR_CODE).send({ message: 'логин или пароль отсутствует' });

  bcrypt.hash(password, SAULT_ROUNDS, (error, hash) => {
    userModel.findOne({ email })
      .then((user) => {
        if (user) return res.status(409).send({ message: 'Такой пользователь уже существует' }).send(user);

        return userModel.create({
          email, password: hash, name, about, avatar,
        })
          .then((newUser) => {
            res.status(201).send(newUser);
          })
          .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
              res.status(VALIDATIONERROR_CODE).send({ message: err.message });
            } else {
              res.status(SERVERERROR_CODE).send({ message: 'Server error' });
            }
          });
      });
  });
};

// Получить всех пользователей
const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(SERVERERROR_CODE).send({ message: 'Server error' });
    });
};
// Получить пользователя по id
const getUserById = (req, res) => {
  const { userId } = req.params;
  userModel
    .findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(VALIDATIONERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVERERROR_CODE).send({ message: 'Server error' });
      }
    });
};

// Обновить информацию о пользователе
const updateUser = (req, res) => {
  const userId = req.user._id;
  userModel
    .findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATIONERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVERERROR_CODE).send({ message: 'Server error' });
      }
    });
};

// Вернуть информацию о пользователе
const getUserInfo = (req, res) => {
  const userId = req.user._id;

  userModel
    .findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(VALIDATIONERROR_CODE).send({ message: err.message });
      }
      return res.status(SERVERERROR_CODE).send({ message: 'Server error' });
    });
};

// Обновить аватар
const updateAvatar = (req, res) => {
  const userId = req.user._id;
  userModel
    .findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .then((avatar) => {
      res.status(200).send(avatar);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATIONERROR_CODE).send({ message: 'Некорректный URL' });
      } else {
        res.status(SERVERERROR_CODE).send({ message: 'Server error' });
      }
    });
};

// Auth
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) res.status(VALIDATIONERROR_CODE).send({ message: 'логин или пароль отсутствует' });

  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return res.status(401).send({ message: 'Такого пользователя не существует' });
      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) return res.status(401).send({ message: 'Логин или пароль неправильный' });

          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          });

          return res.status(200).send({ token });
        });
    })
    .catch(() => res.status(400).send({ message: 'Что-то пошло не так' }));
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
