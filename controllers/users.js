const bcrypt = require('bcrypt');

const { generateToken } = require('../middlewares/auth');

const User = require('../models/user');

const saltRounds = 10;
const MONGO_DUPLICATE_KEY_CODE = 11000;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь по указанному id не найден');
        err.statusCode = 404;
        throw err;
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const getUserProfile = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    const err = new Error('Email и пароль обязательны');
    err.statusCode = 400;
    throw err;
  }

  bcrypt.hash(password, saltRounds).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        const resUser = {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
          __v: user.__v,
        };

        res.send(resUser);
      })
      .catch((err) => {
        if (err.code === MONGO_DUPLICATE_KEY_CODE) {
          const duplicateError = new Error('Этот email уже зарегистрирован');
          duplicateError.statusCode = 409;
          return next(duplicateError);
        }

        return next(err);
      });
  });
};

const updateUser = (req, res, next) => {
  const { id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь по указанному id не найден');
        err.statusCode = 404;
        throw err;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь по указанному id не найден');
        err.statusCode = 404;
        throw err;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Email или пароль неверный');
        err.statusCode = 401;
        throw err;
      }

      const isPasswordValid = bcrypt.compare(password, user.password);

      return Promise.all([isPasswordValid, user]);
    })
    .then(([isPasswordValid, user]) => {
      if (!isPasswordValid) {
        const err = new Error('Email или пароль неверный');
        err.statusCode = 401;
        throw err;
      }
      return generateToken({ id: user._id });
    })
    .then((token) => res.send({ token }))
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserProfile,
};
