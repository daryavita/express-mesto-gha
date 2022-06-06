const user = require('../models/user');

const getUsers = (_, res) => {
  user
    .find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

const getUser = (req, res) => {
  const { id } = req.params;

  user
    .findById(id)
    .then((users) => {
      if (!users) {
        res
          .status(400)
          .send({ message: 'User not found' });
        return;
      }
      res.status(200).send(users);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user
    .create({ name, about, avatar })
    .then((users) => {
      if (!name || !about || !avatar) {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }

      res.send({ data: users });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

const updateUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;

  user.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

const updateAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;

  user.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
