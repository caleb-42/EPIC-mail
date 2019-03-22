import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import dbHandler from '../database/dbHandler';

dotenv.config();

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send({
      status: 401,
      error: 'Access denied, no token provided',
    });
  }
  const decoded = jwt.verify(token, process.env.jwtPrivateKey);
  const user = await dbHandler.find('users', { id: decoded.id }, 'id');
  if (!user) {
    return res.status(404).send({
      status: 401,
      error: 'Access denied, no token provided User does not exist',
    });
  }
  try {
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
