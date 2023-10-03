const { celebrate, Joi } = require('celebrate');

const checkIdCards = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

const checkIdUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

const checkNameAndLink = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/^(https?:\/\/)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]/),
  }).unknown(true),
});

const checkUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const checkUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(https?:\/\/)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]/),
  }),
});

module.exports = {
  checkIdCards,
  checkNameAndLink,
  checkIdUser,
  checkUserInfo,
  checkUserAvatar,
};
