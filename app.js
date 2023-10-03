require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');

const appRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { checkSigninInfo, checkSignupInfo } = require('./middlewares/validation');

const { PORT, DB_URL } = process.env;

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
app.post('/signin', checkSigninInfo, login);
app.post('/signup', checkSignupInfo, createUser);

// Авторизация
app.use(auth);

app.use(appRouter);

app.use(errors());

// Центральный обработчик ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
