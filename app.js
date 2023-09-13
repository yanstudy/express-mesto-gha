const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const appRouter = require('./routes/index');

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

// Авторизация (временное решение)
app.use((req, res, next) => {
  req.user = {
    _id: '64ff096302264654f3ed37a5',
  };

  next();
});

app.use(appRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
