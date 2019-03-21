import joi from 'joi';
import express from 'express';
import dbHandler from '../database/dbHandler';
import auth from '../middleware/auth';

const router = express.Router();

const validate = (user) => {
  const schema = {
    name: joi.string().required(),
  };
  return joi.validate(user, schema);
};

const validateAddUser = (user) => {
  const schema = {
    id: joi.number().required(),
  };
  return joi.validate(user, schema);
};

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({
      status: 400,
      error: error.details[0].message,
    });
  }
  const group = await dbHandler.find('groups', req.body, 'name');
  if (group) {
    return res.status(400).send({
      status: 400,
      error: 'Group already registered',
    });
  }
  req.body.role = 'admin';
  req.body.userid = req.user.id;
  return res.status(201).send({
    status: 201,
    data: await dbHandler.createGroup(req.body),
  });
});

router.post('/:id/users', auth, async (req, res) => {
  const { id } = req.params;
  const { error } = validateAddUser(req.body);
  if (error) {
    return res.status(400).send({
      status: 400,
      error: error.details[0].message,
    });
  }
  const user = await dbHandler.find('users', { id: req.body.id }, 'id');
  if (!user) {
    return res.status(404).send({
      status: 404,
      error: 'User ID does not exist',
    });
  }
  const groupuser = await dbHandler.find('groupmembers', { userid: req.body.id }, 'userid');
  if (groupuser) {
    return res.status(400).send({
      status: 400,
      error: 'User Already in group',
    });
  }
  const group = await dbHandler.find('groups', { id }, 'id');
  if (!group) {
    return res.status(404).send({
      status: 404,
      error: 'Group ID does not exist',
    });
  }
  req.body.groupid = id;
  return res.status(201).send({
    status: 201,
    data: await dbHandler.groupAddUser(req.body),
  });
});


module.exports = router;
