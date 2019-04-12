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
    email: joi.string().email().trim().required(),
  };
  return joi.validate(user, schema);
};

const validateSendMessage = (msg) => {
  const schema = {
    subject: joi.string().trim().max(32).required(),
    message: joi.string().trim().required(),
    parentMessageId: joi.number().optional(),
  };
  return joi.validate(msg, schema);
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
  if (group === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  if (group) {
    return res.status(400).send({
      status: 400,
      error: 'Group already registered',
    });
  }
  req.body.role = 'admin';
  req.body.userid = req.user.id;
  req.body.name = req.body.name.toLowerCase();
  const newgroup = await dbHandler.createGroup(req.body);
  if (newgroup === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  return res.status(201).send({
    status: 201,
    data: newgroup,
  });
});

router.get('/', auth, async (req, res) => {
  const msg = await dbHandler.getGroups(req.user.id);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  res.status(200).send({
    status: 200,
    data: msg,
  });
});

router.get('/:id/users', auth, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).send({
      status: 400,
      error: 'param IDs must be numbers',
    });
  }
  const getGroupMembers = await dbHandler.getGroupMembers(id);
  if (getGroupMembers === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  res.status(200).send({
    status: 200,
    data: getGroupMembers,
  });
});

router.post('/:id/users', auth, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).send({
      status: 400,
      error: 'param IDs must be numbers',
    });
  }
  const { error } = validateAddUser(req.body);
  if (error) {
    return res.status(400).send({
      status: 400,
      error: error.details[0].message,
    });
  }
  req.body.email = req.body.email.toLowerCase();
  const user = await dbHandler.find('users', { email: req.body.email }, 'email');
  if (user === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  if (!user) {
    return res.status(404).send({
      status: 404,
      error: 'User ID does not exist',
    });
  }
  console.log(user.id, req.user.id);
  if (user.id === req.user.id) {
    return res.status(400).send({
      status: 400,
      error: 'You cannot be a member of a group you created',
    });
  }
  const group = await dbHandler.find('groups', { id }, 'id');
  if (group === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  if (!group) {
    return res.status(404).send({
      status: 404,
      error: 'Group ID does not exist',
    });
  }
  const groupuser = await dbHandler.findArray('groupmembers', { userid: user.id, groupid: group.id }, ['userid', 'groupid']);
  if (groupuser === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  if (groupuser) {
    return res.status(400).send({
      status: 400,
      error: 'User Already in group',
    });
  }
  req.body.groupid = id;
  req.body.id = user.id;
  const msg = await dbHandler.groupAddUser(req.body);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  return res.status(201).send({
    status: 201,
    data: msg,
  });
});

router.patch('/:id/name', auth, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).send({
      status: 400,
      error: 'param IDs must be numbers',
    });
  }
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({
      status: 400,
      error: error.details[0].message,
    });
  }
  let group = await dbHandler.find('groups', { id }, 'id');
  if (group === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  if (!group) {
    return res.status(404).send({
      status: 404,
      error: 'Group ID does not exist',
    });
  }
  group = await dbHandler.find('groups', { name: req.body.name }, 'name');
  if (group === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  if (group) {
    return res.status(400).send({
      status: 400,
      error: 'Group already registered',
    });
  }
  const msg = await dbHandler.updateGroupById(id, req.body);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).send({
      status: 400,
      error: 'param IDs must be numbers',
    });
  }
  const group = await dbHandler.find('groups', { id }, 'id');
  if (group === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  if (!group) {
    return res.status(404).send({
      status: 404,
      error: 'Group ID does not exist',
    });
  }

  if (group.userid !== req.user.id) {
    return res.status(401).send({
      status: 401,
      error: 'You are not authorized to delete this group',
    });
  }
  const msg = await dbHandler.deleteGroup(group, req.user);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

router.delete('/:groupid/users/:userid', auth, async (req, res) => {
  const { groupid } = req.params;
  const { userid } = req.params;
  if (isNaN(groupid) || isNaN(userid)) {
    return res.status(400).send({
      status: 400,
      error: 'param IDs must be numbers',
    });
  }
  const group = await dbHandler.find('groups', { id: groupid }, 'id');
  if (group === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  if (!group) {
    return res.status(404).send({
      status: 404,
      error: 'Group ID does not exist',
    });
  }
  const user = await dbHandler.find('groupmembers', { userid }, 'userid');
  if (user === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  if (!user) {
    return res.status(404).send({
      status: 404,
      error: 'User ID does not exist in group',
    });
  }
  const msg = await dbHandler.groupDeleteUser(user, group);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

router.post('/:id/messages', auth, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).send({
      status: 400,
      error: 'param IDs must be numbers',
    });
  }
  const group = await dbHandler.find('groups', { id }, 'id');
  if (group === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  if (!group) {
    return res.status(404).send({
      status: 404,
      error: 'Group ID does not exist',
    });
  }
  const { error } = validateSendMessage(req.body);
  if (error) {
    return res.status(400).send({
      status: 400,
      error: error.details[0].message,
    });
  }
  req.body.groupid = id;
  req.body.senderid = req.user.id;
  const msg = await dbHandler.groupSendMsg(req.body);
  if (msg.length < 1) {
    return res.status(400).send({
      status: 400,
      error: 'Group has no members',
    });
  }
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  return res.status(201).send({
    status: 201,
    data: msg,
  });
});


module.exports = router;
