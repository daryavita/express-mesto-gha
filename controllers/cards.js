const card = require('../models/card');

const getCards = (_, res) => {
  card
    .find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Server error' });
    });
};

const deleteCard = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        res
          .status(404)
          .send({ message: 'Card not found' });
        return;
      }

      res.status(200).send('Card has been deleted');
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Server error' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  card
    .create({ name, link, owner })
    .then((cards) => {
      if (!name || !link) {
        res
          .status(404)
          .send({ message: 'Name or link not found' });
        return;
      }

      res.send({ data: cards });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Server error' });
    });
};

const likeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Server error' });
    });
};

const dislikeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Server error' });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
