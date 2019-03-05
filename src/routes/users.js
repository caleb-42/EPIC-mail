const _ = require('lodash');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = require('express').Router();
const { db } = require('../db');


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
  /* console.log(req.body); */
  const { error } = validate(req.body);
  if (error) {
    return res.send({
      status: 400,
      error: error.details[0].message,
    });
  }
  let user = db.users.find(usr => usr.email === req.body.email);
  if (user) {
    return res.send({
      status: 400,
      error: 'User already registered',
    });
  }
  const id = (db.users).length + 1;
  user = _.pick(req.body, ['firstName', 'lastName', 'email', 'phoneNumber', 'isAdmin', 'password']);
  user.id = id;
  user.isAdmin = id === 1;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  db.users.push(user);
  const token = jwt.sign({ id: user.id }, config.get('jwtPrivateKey'));
  /* const resp = _.pick(user, ['id', 'firstName', 'lastName', 'email', 'isAdmin']); */
  const resp = [{ token }];
  return res.send({
    status: 201,
    data: resp,
  });
});

module.exports = router;
