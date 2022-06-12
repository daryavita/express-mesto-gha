const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete('/:cardId', deleteCard);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      link: Joi.string().pattern(
        /(https?:\/\/)(www\.)?[A-z0-9.-]+\.[.A-z]*#?([^\s?#]+)?/,
      ),
    }),
  }),
  createCard,
);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports.cardRouter = router;
