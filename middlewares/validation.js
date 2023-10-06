const { celebrate, Joi } = require('celebrate');

const checkIdCards = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

const checkIdUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
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
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const checkUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(https?:\/\/)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]/),
  }),
});

const checkSigninInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
});

const checkSignupInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(/^(https?:\/\/)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]/),
  }).unknown(true),
});

module.exports = {
  checkIdCards,
  checkNameAndLink,
  checkIdUser,
  checkUserInfo,
  checkUserAvatar,
  checkSigninInfo,
  checkSignupInfo,
};
