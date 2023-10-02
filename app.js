const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const appRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

// База данных
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to db'));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

// Незащищённые роуты
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }).unknown(true),
}), createUser);

// Авторизация
app.use(auth);

app.use(appRouter);

app.use(errors());
// Центральный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
