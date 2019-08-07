import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { mail } from '../vars';
import dbHandler from '../database/dbHandler';
import helper from '../utilities';

const userAlreadyRegistered = { status: 400, error: 'User already registered' };

const invalidMailPassword = { status: 400, error: 'Invalid email or password' };

export const signUp = async (req, res, next) => {
  if (req.error) return next();
  const userPresent = await dbHandler.find('users', req.body, ['email']);
  if (userPresent) {
    req.error = userAlreadyRegistered;
    return next();
  }
  const token = await dbHandler.createUser(req.body);
  const user = await dbHandler.find('users', req.body, ['email']);

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
};

export const logIn = async (req, res, next) => {
  if (req.error) return next();
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
};

export const sendResetLink = async (req, res, next) => {
  if (req.error) next();
  req.body.email = req.body.email.toLowerCase();
  const userPresent = await dbHandler.find('users', req.body, ['email']);
  if (userPresent === 500) return next();
  /* console.log(userPresent, req.body); */
  if (!userPresent) {
    req.error = { status: 404, error: 'email not found' };
    return next();
  }
  const resettoken = crypto.randomBytes(20).toString('hex');
  const resetexpire = Date.now() + 360000;
  dbHandler.updateUser(userPresent.id,
    { resettoken, resetexpire });
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mail.address,
      pass: mail.password,
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
  transporter.sendMail(mailOptions, (er) => {
    if (er) {
      req.error = { status: 501, error: 'The message failed to send' };
      return next();
    }
    return res.status(200).json({
      status: 200,
      data: [{
        message: 'Check your email for password reset link',
        email: userPresent.recoveryemail,
      }],
    });
  });
};

export const checkResetLink = async (req, res, next) => {
  if (req.error) next();
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
};
