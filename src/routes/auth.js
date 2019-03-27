import joi from 'joi';
import express from 'express';
import bcrypt from 'bcrypt';
import helper from '../utilities';
import dbHandler from '../database/dbHandler';

const router = express.Router();

const validate = (user) => {
  const schema = {
    /* id: joi.number().equal(0), */
    email: joi.string().email().required(),
    password: joi.string().min(5).max(255).required(),
  };
  return joi.validate(user, schema);
};

const validateLogIn = (user) => {
  const schema = {
    firstName: joi.string().trim().min(3).max(15)
      .required(),
    lastName: joi.string().trim().min(3).max(15)
      .required(),
    email: joi.string().trim().email().required(),
    phoneNumber: joi.number().required(),
    password: joi.string().trim().min(5).max(255)
      .required(),
    confirmPassword: joi.any().valid(joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match with password' } } }),
  };
  return joi.validate(user, schema);
};

router.post('/login', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.send({
      status: 400,
      error: error.details[0].message,
    });
  }
  req.body.email = req.body.email.toLowerCase();
  const user = await dbHandler.find('users', req.body, 'email');
  if (user === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  if (!user) {
    return res.status(400).send({
      status: 400,
      error: 'Invalid email or password',
    });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  const token = validPassword ? helper.generateJWT(user) : false;
  if (token === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  if (!token) {
    return res.status(400).send({
      status: 400,
      error: 'Invalid email or password',
    });
  }
  return res.status(200).send({
    status: 200,
    data: [
      {
        token,
        firstName: user.firstName,
      },
    ],
  });
});

router.post('/signup', async (req, res) => {
  const { error } = validateLogIn(req.body);
  if (error) {
    return res.status(400).send({
      status: 400,
      error: error.details[0].message,
    });
  }
  const email = String(req.body.email);
  req.body.email = `${email.toLowerCase().substring(0, email.indexOf('@'))}@epicmail.com`;
  const userPresent = await dbHandler.find('users', req.body, 'email');
  if (userPresent === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  if (userPresent) {
    return res.status(400).send({
      status: 400,
      error: 'User already registered',
    });
  }
  const token = await dbHandler.createUser(req.body);
  if (token === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(201).send({
    status: 201,
    data: [{ token }],
  });
});
export default router;
