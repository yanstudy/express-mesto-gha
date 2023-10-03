const mongoose = require('mongoose');
const cardsModel = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const LackOfRights = require('../errors/lack-of-rights');

// Получить все карточки
const getCards = (req, res, next) => {
  cardsModel
    .find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

// Создать новую карточку
const createCard = (req, res, next) => {
  cardsModel
    .create({ owner: req.user._id, ...req.body })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch(next);
};

// Удалить карточку
const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;

  cardsModel.findById(cardId)
    .then((currentCard) => {
      if (!currentCard) {
        throw new NotFoundError('Такой карточки нет в базе данных');
      }

      if (currentCard.owner.toString() === owner) {
        cardsModel
          .findByIdAndDelete(cardId)
          .orFail(new Error('NotValidId'))
          .then(() => {
            res.status(200).send({ message: 'Карточка успешно удалена' });
          })
          .catch(next);
      } else {
        throw new LackOfRights('Отсутствуют права на удаление этой карточки');
      }
    })
    .catch(next);
};

// Поставить лайк карточке
const addLike = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: 'Карточка не найдена' });
  }

  return cardsModel
    .findById(cardId)
    .orFail(new Error('NotValidId'))
    .then(() => (cardsModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )))
    .then((like) => {
      res.status(201).send(like);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Server error' });
      }
    });
};

// Убрать лайк с карточки
const deleteLike = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    res.status(400).send({ message: 'Карточка не найдена' });
  }

  cardsModel
    .findById(cardId)
    .orFail(new Error('NotValidId'))
    .then(() => (cardsModel.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )))
    .then((like) => {
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Server error' });
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
