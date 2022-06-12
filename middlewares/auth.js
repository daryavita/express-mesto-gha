const jwt = require('jsonwebtoken');

const generateToken = (payload) => jwt.sign(payload, '12341234', { expiresIn: '7d' });

const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    const err = new Error('Требуется авторизация');
    err.statusCode = 401;
    throw err;
  }

  const token = auth.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '12341234');
  } catch (e) {
    const err = new Error('Ошибка авторизации');
    err.statusCode = 401;
    return next(err);
  }
  req.user = payload;
  return next();
};

module.exports = {
  generateToken,
  isAuthorized,
};
