const Сard = require('../models/card');

const getCards = (req, res) => {
  Сard
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  Сard
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Карточка с указанным id не найдена.' });
        return;
      }

      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Некорректный id' });
        return;
      }
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Сard
    .create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
        return;
      }
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  Сard.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Карточка с указанным id не найдена.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Некорректный id' });
        return;
      }
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Сard.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Карточка с указанным id не найдена.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Некорректный id' });
        return;
      }
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
