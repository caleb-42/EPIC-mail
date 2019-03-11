import joi from 'joi';
import express from 'express';
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

router.post('/', async (req, res) => {
  /* console.log(req.body); */
  const { error } = validate(req.body);
  if (error) {
    return res.send({
      status: 400,
      error: error.details[0].message,
    });
  }
  const user = dbHandler.find('users', req.body, 'email');
  if (!user) {
    return res.send({
      status: 400,
      error: 'Invalid email or password',
    });
  }
  const token = await dbHandler.validateUser(req.body, user);
  if (!token) {
    return res.send({
      status: 400,
      error: 'Invalid email or password',
    });
  }
  return res.send({
    status: 200,
    data: [
      {
        token,
        firstName: user.firstName,
      },
    ],
  });
});

module.exports = router;
