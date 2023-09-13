const mongoose = require('mongoose');
const userModel = require('../models/user');

const VALIDATIONERROR_CODE = 400;
const SERVERERROR_CODE = 500;

// Создание пользователя
const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(VALIDATIONERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVERERROR_CODE).send({ message: 'Server error' });
      }
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
        res.status(VALIDATIONERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVERERROR_CODE).send({ message: 'Server error' });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
