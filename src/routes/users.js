import joi from 'joi';
import express from 'express';
import dbHandler from '../dbHandler';
import auth from '../middleware/auth';

const router = express.Router();

const validate = (user) => {
  const schema = {
    /* id: joi.number().equal(0), */
    firstName: joi.string().min(3).max(15).required(),
    lastName: joi.string().min(3).max(15).required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string().max(13).min(13).required(),
    password: joi.string().min(5).max(255).required(),
  };
  return joi.validate(user, schema);
};

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.send({
      status: 400,
      error: error.details[0].message,
    });
  }
  const userPresent = dbHandler.find('users', req.body, 'email');
  if (userPresent) {
    return res.send({
      status: 400,
      error: 'User already registered',
    });
  }
  const token = await dbHandler.createUser(req.body);
  return res.send({
    status: 201,
    data: [{ token }],
  });
});

router.put('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.send({
      status: 400,
      error: error.details[0].message,
    });
  }
  const userPresent = dbHandler.find('users', req.body, 'email');
  if (userPresent) {
    return res.send({
      status: 400,
      error: 'User already registered',
    });
  }
  const token = await dbHandler.createUser(req.body);
  return res.send({
    status: 201,
    data: [{ token }],
  });
});

module.exports = router;
