import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send({
      status: 401,
      error: 'Access denied, no token provided',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(400).send({
      status: 400,
      error: 'Invalid token',
    });
  }
};
module.exports = auth;
