const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.patch('/users/me', updateUser);
router.get('/users/me', getUserInfo);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().min(2).max(30),
  }),
}), updateAvatar);
router.get('/users/:userId', getUserById);

router.use(errors());
module.exports = router;
