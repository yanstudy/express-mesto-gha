const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/^(https?:\/\/)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])+$/),
  }).unknown(true),
}), createCard);
router.delete('/cards/:cardId', deleteCardById);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), addLike);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteLike);

router.use(errors());
module.exports = router;
