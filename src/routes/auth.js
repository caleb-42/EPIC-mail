import express from 'express';
import bcrypt from 'bcrypt';
import helper from '../utilities';
import error from '../middleware/error';
import dbHandler from '../database/dbHandler';

const router = express.Router();

const invalidMailPassword = { status: 400, error: 'Invalid email or password' };
const userAlreadyRegistered = { status: 400, error: 'User already registered' };

router.post('/login', async (req, res, next) => {
  const err = helper.validateLogIn(req.body).error;
  if (err) {
    req.error = { status: 400, error: err.details[0].message };
    return next();
  }
  req.body.email = req.body.email.toLowerCase();
  const user = await dbHandler.find('users', req.body, ['email']);
  if (user === 500) return next();
  if (!user) {
    req.error = invalidMailPassword;
    return next();
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  const token = validPassword ? helper.generateJWT(user) : false;
  if (token === 500) return next();
  if (!token) {
    req.error = invalidMailPassword;
    return next();
  }
  res.cookie('token', token);
  return res.status(200).json({
    status: 200,
    data: [
      {
        token,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        phoneNumber: user.phonenumber,
        recoveryEmail: user.recoveryemail,
        id: user.id,
        dp: user.dp,
      },
    ],
  });
}, error);

router.post('/signup', async (req, res, next) => {
  const err = helper.validateSignUp(req.body).error;
  if (err) {
    req.error = { status: 400, error: err.details[0].message };
    return next();
  }
  const email = String(req.body.email);
  req.body.email = `${email.toLowerCase().substring(0, email.indexOf('@'))}@epicmail.com`;
  const userPresent = await dbHandler.find('users', req.body, ['email']);
  if (userPresent === 500) return next();
  if (userPresent) {
    req.error = userAlreadyRegistered;
    return next();
  }
  const token = await dbHandler.createUser(req.body);
  if (token === 500) return next();
  const user = await dbHandler.find('users', req.body, ['email']);
  res.cookie('token', token);
  return res.status(201).json({
    status: 201,
    data: [{
      token,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      phoneNumber: user.phonenumber,
      recoveryEmail: user.recoveryemail,
      id: user.id,
      dp: user.dp,
    }],
  });
}, error);
export default router;
