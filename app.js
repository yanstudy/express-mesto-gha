const express = require("express");
const mongoose = require("mongoose");
const appRouter = require("./routes/index");

// База данных
mongoose
  .connect("mongodb://127.0.0.1/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to db"));

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Авторизация (временное решение)
app.use((req, res, next) => {
  req.user = {
    _id: "64ff096302264654f3ed37a5",
  };

  next();
});

app.use(appRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
