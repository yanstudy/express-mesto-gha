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
      } else {
        return res.status(500).send({ message: "Server error" });
      }
    });
};

// Удалить карточку
const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  cardsModel
    .findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      } else {
        return res.status(200).send({ message: "Карточка успешно удалена" });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: err.message });
      } else {
        return res.status(500).send({ message: "Server error" });
      }
    });
};

// Поставить лайк карточке
const addLike = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: "Карточка не найдена" });
  }

  cardsModel
    .findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }

      return cardsModel.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        { new: true }
      );
    })
    .then((like) => {
      return res.status(201).send(like);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      } else {
        return res.status(500).send({ message: "Server error" });
      }
    });
};

// Убрать лайк с карточки
const deleteLike = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: "Карточка не найдена" });
  }

  cardsModel
    .findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }

      return cardsModel.findByIdAndUpdate(
        cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
        { new: true }
      );
    })
    .then((like) => {
      return res.status(200).send(like);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: err.message });
      } else {
        return res.status(500).send({ message: "Server error" });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
