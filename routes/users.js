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
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.get('/users/me', getUserInfo);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(https?:\/\/)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])+$/),
  }),
}), updateAvatar);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.use(errors());
module.exports = router;
