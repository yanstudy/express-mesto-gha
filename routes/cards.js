const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require('../controllers/cards');

const checkIdCards = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/^(https?:\/\/)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]/),
  }).unknown(true),
}), createCard);

router.delete('/cards/:cardId', checkIdCards, deleteCardById);
router.put('/cards/:cardId/likes', checkIdCards, addLike);
router.delete('/cards/:cardId/likes', checkIdCards, deleteLike);

router.use(errors());
module.exports = router;
