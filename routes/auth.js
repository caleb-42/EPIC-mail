const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = require('express').Router();
const { db } = require('../db');


const validate = (user) => {
  const schema = {
    /* id: joi.number().equal(0), */
    email: joi.string().email().required(),
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
  const user = db.users.find(usr => usr.email === req.body.email);
  if (!user) {
    return res.send({
      status: 400,
      error: 'Invalid email or password',
    });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.send({
      status: 400,
      error: 'Invalid email or password',
    });
  }
  const token = jwt.sign({ id: user.id }, config.get('jwtPrivateKey'));
  const resp = [{ token, firstName: user.firstName }];
  return res.send({
    status: 200,
    data: resp,
  });
});

module.exports = router;
