const mongoose = require("mongoose");
const cardsModel = require("../models/card");

// Получить все карточки
const getCards = (req, res) => {
  cardsModel
    .find({})
    .then((cards) => {
      return res.status(200).send(cards);
    })
    .catch((err) => {
      return res.status(500).send({ message: "Server error" });
    });
};

// Создать новую карточку
const createCard = (req, res) => {
  cardsModel
    .create({ owner: req.user._id, ...req.body })
    .then((card) => {
      return res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server error" });
    });
};

// Удалить карточку
const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  cardsModel
    .findByIdAndDelete(cardId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res.status(200).send({ message: "Карточка успешно удалена" });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server error" });
    });
};

// Поставить лайк карточке
const addLike = (req, res) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    )
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server error" });
    });
};

// Убрать лайк с карточки
const deleteLike = (req, res) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    )
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Server error" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
