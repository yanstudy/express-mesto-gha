const mongoose = require("mongoose");
const userModel = require("../models/user");

// Создание пользователя
const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server error" });
    });
};

// Получить всех пользователей
const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      return res.status(500).send({ message: "Server error" });
    });
};
// Получить пользователя по id
const getUserById = (req, res) => {
  const { userId } = req.params;
  userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server error" });
    });
};

// Обновить информацию о пользователе
const updateUser = (req, res) => {
  const userId = req.user._id;
  userModel
    .findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server error" });
    });
};

// Обновить аватар
const updateAvatar = (req, res) => {
  const userId = req.user._id;
  userModel
    .findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .then((avatar) => {
      return res.status(201).send(avatar);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server error" });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
