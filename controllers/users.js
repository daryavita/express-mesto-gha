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
        .send({ message: 'Server error' });
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
        .send({ message: 'Server error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user
    .create({ name, about, avatar })
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Server error' });
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
        .send({ message: 'Server error' });
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
        .send({ message: 'Server error' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
