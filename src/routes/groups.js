import express from 'express';
import dbHandler from '../database/dbHandler';
import error from '../middleware/error';
import validator from '../utilities';
import auth from '../middleware/auth';

const router = express.Router();

const paramIdMustBeNumber = { status: 400, error: 'param IDs must be numbers' };
const noMembers = { status: 400, error: 'Group has no members' };
const userAlreadyInGroup = { status: 400, error: 'User Already in group' };
const userIdNotFound = { status: 404, error: 'User ID does not exist in group' };
const groupIdNotFound = { status: 404, error: 'Group ID does not exist' };
const groupAlreadyRegistered = { status: 400, error: 'Group already registered' };
const userNotGroupMember = { status: 400, error: 'You cannot be a member of a group you created' };
const groupNotAuthorized = { status: 401, error: 'You are not authorized to access this Group' };

router.post('/', auth, async (req, res, next) => {
  const err = validator.validateGroup(req.body).error;
  if (err) {
    req.error = { status: 400, error: err.details[0].message };
    return next();
  }
  const group = await dbHandler.find('groups', req.body, ['name']);
  if (group === 500) return next();
  if (group) {
    req.error = groupAlreadyRegistered;
    return next();
  }
  req.body.role = 'admin';
  req.body.userid = req.user.id;
  req.body.name = req.body.name.toLowerCase();
  const newgroup = await dbHandler.createGroup(req.body);
  if (newgroup === 500) return next();
  res.status(201).json({ status: 201, data: newgroup });
}, error);

router.get('/', auth, async (req, res, next) => {
  const msg = await dbHandler.getGroups(req.user.id);
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

router.get('/:id/users', auth, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    req.error = paramIdMustBeNumber;
    return next();
  }
  const group = await dbHandler.find('groups', { id }, ['id']);
  if (group === 500) return next();
  if (!group) {
    req.error = groupIdNotFound;
    return next();
  }
  if (group.userid !== req.user.id) {
    req.error = groupNotAuthorized;
    return next();
  }
  const getGroupMembers = await dbHandler.getGroupMembers(id);
  if (getGroupMembers === 500) return next();
  res.status(200).json({ status: 200, data: getGroupMembers });
}, error);

router.post('/:id/users', auth, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    req.error = paramIdMustBeNumber;
    return next();
  }
  const err = validator.validateGroupAddUser(req.body).error;
  if (err) {
    req.error = { status: 400, error: err.details[0].message };
    return next();
  }
  req.body.email = req.body.email.toLowerCase();
  const user = await dbHandler.find('users', { email: req.body.email }, ['email']);
  if (user === 500) return next();
  if (!user) {
    req.error = userIdNotFound;
    return next();
  }
  if (user.id === req.user.id) {
    req.error = userNotGroupMember;
    return next();
  }
  const group = await dbHandler.find('groups', { id }, ['id']);
  if (group === 500) return next();
  if (!group) {
    req.error = groupIdNotFound;
    return next();
  }
  if (group.userid !== req.user.id) {
    req.error = groupNotAuthorized;
    return next();
  }
  const groupuser = await dbHandler.find('groupmembers', { userid: user.id, groupid: group.id }, ['userid', 'groupid']);
  if (groupuser === 500) return next();
  if (groupuser) {
    req.error = userAlreadyInGroup;
    return next();
  }
  req.body.groupid = id;
  req.body.id = user.id;
  const msg = await dbHandler.groupAddUser(req.body);
  if (msg === 500) return next();
  res.status(201).json({ status: 201, data: msg });
}, error);

router.patch('/:id/name', auth, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    req.error = paramIdMustBeNumber;
    return next();
  }
  const err = validator.validateGroup(req.body).error;
  if (err) {
    req.error = { status: 400, error: err.details[0].message };
    return next();
  }
  let group = await dbHandler.find('groups', { id }, ['id']);
  if (group === 500) return next();
  if (!group) {
    req.error = groupIdNotFound;
    return next();
  }
  if (group.userid !== req.user.id) {
    req.error = groupNotAuthorized;
    return next();
  }
  group = await dbHandler.find('groups', { name: req.body.name }, ['name']);
  if (group === 500) return next();
  if (group) {
    req.error = groupAlreadyRegistered;
    return next();
  }
  const msg = await dbHandler.updateGroupById(id, req.body);
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

router.delete('/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    req.error = paramIdMustBeNumber;
    return next();
  }
  const group = await dbHandler.find('groups', { id }, ['id']);
  if (group === 500) return next();
  if (!group) {
    req.error = groupIdNotFound;
    return next();
  }
  if (group.userid !== req.user.id) {
    req.error = groupNotAuthorized;
    return next();
  }
  const msg = await dbHandler.deleteGroup(group, req.user);
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

router.delete('/:groupid/users/:userid', auth, async (req, res, next) => {
  const { groupid } = req.params;
  const { userid } = req.params;
  if (isNaN(groupid) || isNaN(userid)) {
    req.error = paramIdMustBeNumber;
    return next();
  }
  const group = await dbHandler.find('groups', { id: groupid }, ['id']);
  if (group === 500) return next();
  if (!group) {
    req.error = groupIdNotFound;
    return next();
  }
  if (group.userid !== req.user.id) {
    req.error = groupNotAuthorized;
    return next();
  }
  const user = await dbHandler.find('groupmembers', { userid }, ['userid']);
  if (user === 500) return next();
  if (!user) {
    req.error = userIdNotFound;
    return next();
  }
  const msg = await dbHandler.groupDeleteUser(user, group);
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

router.post('/:id/messages', auth, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    req.error = paramIdMustBeNumber;
    return next();
  }
  const group = await dbHandler.find('groups', { id }, ['id']);
  if (group === 500) return next();
  if (!group) {
    req.error = groupIdNotFound;
    return next();
  }
  if (group.userid !== req.user.id) {
    req.error = groupNotAuthorized;
    return next();
  }
  const err = validator.validateGroupSendMessage(req.body).error;
  if (err) {
    req.error = { status: 400, error: err.details[0].message };
    return next();
  }
  req.body.groupid = id;
  req.body.senderid = req.user.id;
  const msg = await dbHandler.groupSendMsg(req.body);
  if (msg.length < 1) {
    req.error = noMembers;
    return next();
  }
  if (msg === 500) return next();
  res.status(201).json({ status: 201, data: msg });
}, error);


module.exports = router;
