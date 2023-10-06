const cardsModel = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const LackOfRights = require('../errors/lack-of-rights-err');

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
        currentCard.deleteOne()
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
const addLike = (req, res, next) => {
  const { cardId } = req.params;

  return cardsModel
    .findById(cardId)
    .orFail(new NotFoundError('Нет такой карточки'))
    .then(() => (cardsModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )))
    .then((like) => {
      res.status(201).send(like);
    })
    .catch(next);
};

// Убрать лайк с карточки
const deleteLike = (req, res, next) => {
  const { cardId } = req.params;

  cardsModel
    .findById(cardId)
    .orFail(new NotFoundError('Нет такой карточки'))
    .then(() => (cardsModel.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )))
    .then((like) => {
      res.status(200).send(like);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
