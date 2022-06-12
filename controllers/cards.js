const Сard = require('../models/card');

const getCards = (req, res, next) => {
  Сard
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Сard
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        const err = new Error('Карточка не найдена');
        err.statusCode = 404;
        throw err;
      }
      const owner = card.owner.toString();
      if (owner !== req.user.id) {
        const err = new Error('Вы не можете удалить чужую карточку');
        err.statusCode = 403;
        throw err;
      }
      Сard.findByIdAndRemove(req.params.cardId).then(() => {
        res.send({ message: 'Карточка удалена' });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;

  Сard
    .create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Сard
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        const err = new Error('Карточка не найдена');
        err.statusCode = 404;
        throw err;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Сard
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        const err = new Error('Карточка не найдена');
        err.statusCode = 404;
        throw err;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
