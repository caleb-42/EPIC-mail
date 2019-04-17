import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import helper from '../utilities';
import error from '../middleware/error';
import dbHandler from '../database/dbHandler';

dotenv.config();
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
  res.cookie('token', token, {
    httpOnly: true, secure: true, maxAge: 2 * 60 * 60 * 1000,
  });
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
  res.cookie('token', token, {
    httpOnly: true, secure: true, maxAge: 2 * 60 * 60 * 1000,
  });
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

router.post('/reset', async (req, res, next) => {
  const err = helper.validateGroupAddUser(req.body).error;
  if (err) {
    req.error = { status: 400, error: err.details[0].message };
    return next();
  }
  req.body.email = req.body.email.toLowerCase();
  const userPresent = await dbHandler.find('users', req.body, ['email']);
  if (userPresent === 500) return next();
  /* console.log(userPresent, req.body); */
  if (!userPresent) {
    req.error = { status: 400, error: 'email not found' };
    return next();
  }
  const resettoken = crypto.randomBytes(20).toString('hex');
  const resetexpire = Date.now() + 360000;
  dbHandler.updateUser(userPresent.id,
    { resettoken, resetexpire });
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  /* const host = 'http://localhost:3000'; */
  const host = 'https://caleb-42.github.io/EPIC-mail/UI';
  const text = `You are receiving this because you ( or someone else ) have requested the reset of the password for your EPIC-mail account. \n\n Please click on the following link, or paste this link into a browser to complete the process within one hour of receiving it \n\n ${host}/reset.html?token=${resettoken} \n\n If you did not request this, please ignore this email and your password will remain unchanged`;
  const mailOptions = {
    from: 'epicmail@gmail.com',
    to: userPresent.recoveryemail,
    subject: 'Click to reset EPIC-mail password',
    text,
  };
  transporter.sendMail(mailOptions, (er, resp) => {
    if (er) {
      /* console.log(er); */
      req.error = { status: 501, error: 'The message failed to send' };
      return next();
    }
    console.log(`response ${resp}`);
    return res.status(200).json({
      status: 200,
      data: [{
        message: 'Check your email for password reset link',
        email: userPresent.recoveryemail,
      }],
    });
  });
}, error);

router.get('/reset', async (req, res, next) => {
  if (!req.query.token) {
    req.error = { status: 401, error: 'You are not authorized to view this page' };
    return next();
  }
  const { token } = req.query;
  const userPresent = await dbHandler.find('users', { resettoken: token }, ['resettoken']);
  if (userPresent === 500) return next();
  if (!userPresent) {
    req.error = { status: 400, error: 'Password reset link is invalid or has expired' };
    return next();
  }
  const { resetexpire } = userPresent;
  const now = Date.now();
  if (Number(resetexpire) < now) {
    req.error = { status: 400, error: 'Password reset link is invalid or has expired' };
    return next();
  }
  return res.status(200).json({
    status: 200,
    data: [{
      email: userPresent.email,
      id: userPresent.id,
    }],
  });
}, error);

export default router;
