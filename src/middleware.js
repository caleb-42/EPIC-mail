import jwt from 'jsonwebtoken';
import config from 'config';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.send({
      status: 401,
      error: 'Access denied, no token provided',
    });
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (e) {
    return res.send({
      status: 400,
      error: 'Invalid token',
    });
  }
};
module.exports = auth;
