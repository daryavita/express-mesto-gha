const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /(https?:\/\/)(www\.)?[A-z0-9.-]+\.[.A-z]*#?([^\s?#]+)?/,
      ),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
app.use('/users', isAuthorized, userRouter);
app.use('/cards', isAuthorized, cardRouter);

app.use((req, res, next) => {
  const err = new Error('Такая страница не найдена');
  err.statusCode = 404;
  next(err);
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .send({ message: err.message || 'Что-то пошло не так' });
  }
  res.status(500).send({ message: 'Ошибка сервера' });
  return next(err);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
