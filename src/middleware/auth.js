import jwt from 'jsonwebtoken';
import { auth } from '../vars';
import dbHandler from '../database/dbHandler';

const Auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  /* const { token } = req.cookies; */
  /* console.log(req.cookies); */
  if (!token) {
    return res.status(401).send({
      status: 401,
      error: 'Access denied, no token provided',
    });
  }
  const decoded = jwt.verify(token, auth.jwtKey);
  const user = await dbHandler.find('users', { id: decoded.id }, ['id']);
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
module.exports = Auth;
