const router = require('express').Router();
const { errors } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require('../controllers/cards');
const { checkIdCards, checkNameAndLink } = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', checkNameAndLink, createCard);

router.delete('/cards/:cardId', checkIdCards, deleteCardById);
router.put('/cards/:cardId/likes', checkIdCards, addLike);
router.delete('/cards/:cardId/likes', checkIdCards, deleteLike);

router.use(errors());
module.exports = router;
