import express from 'express';
import auth from '../middleware/auth';
import error from '../middleware/error';
import dbHandler from '../database/dbHandler';
import validator from '../utilities';

const router = express.Router();

/* error message and status codes */
const receiverNotfound = { status: 404, error: 'receiver not found' };
const paramIdMustBeNumber = { status: 400, error: 'param IDs must be numbers' };
const messageIdNotFound = { status: 404, error: 'message ID does not exist' };
const notAuthorized = { status: 401, error: 'you are not authorized to access this message' };
const cannotSendMsgToSelf = { status: 400, error: 'user cannot send message to self' };

/* get received messages */
router.get('/', auth, async (req, res, next) => {
  const msg = await dbHandler.getInboxMessages(req.user.id);
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

/* get all messages */
router.get('/all', auth, async (req, res, next) => {
  const msg = await dbHandler.getMessages(req.user.id);
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

/* get unread messages */
router.get('/unread', auth, async (req, res, next) => {
  const msg = await dbHandler.getInboxMessages(req.user.id, 'unread');
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

/* get read messages */
router.get('/read', auth, async (req, res, next) => {
  const msg = await dbHandler.getInboxMessages(req.user.id, 'read');
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
});

/* get all sent messages */
router.get('/sent', auth, async (req, res, next) => {
  const msg = await dbHandler.getOutboxMessages(req.user.id, 'sent');
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

/* get all draft messages */
router.get('/draft', auth, async (req, res, next) => {
  const msg = await dbHandler.getOutboxMessages(req.user.id, 'draft');
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

/* get message by id */
router.get('/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    req.error = paramIdMustBeNumber;
    return next();
  }
  const findMsg = await dbHandler.find('messages', { id }, ['id']);
  if (findMsg === 500) return next();
  if (!findMsg) {
    req.error = messageIdNotFound;
    return next();
  }
  if (findMsg.receiverid !== req.user.id && findMsg.senderid !== req.user.id) {
    req.error = notAuthorized;
    return next();
  }
  const msg = await dbHandler.getMessageById(findMsg, req.user.id);
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

/* send message */
router.post('/', auth, async (req, res, next) => {
  const err = validator.validateMsg(req.body).error;
  if (err) {
    req.error = { status: 400, error: err.details[0].message };
    return next();
  }
  req.body.email = req.body.email.toLowerCase();
  const user = await dbHandler.find('users', req.body, ['email']);
  if (user === 500) return next();
  if (!user) {
    req.error = receiverNotfound;
    return next();
  }
  if (req.user.id === Number(user.id)) {
    req.error = cannotSendMsgToSelf;
    return next();
  }
  req.body.receiverId = user.id;
  req.body.senderId = req.user.id;
  const msg = await dbHandler.sendMessage(req.body);
  if (msg === 500) return next();
  res.status(201).json({ status: 201, data: msg });
}, error);

/* save message as draft */
router.post('/save', auth, async (req, res, next) => {
  const err = validator.validateMsg(req.body).error;
  if (err) {
    req.error = { status: 400, error: err.details[0].message };
    return next();
  }
  req.body.email = req.body.email.toLowerCase();
  const user = await dbHandler.find('users', req.body, ['email']);
  console.log(req.body, user);
  if (user === 500) return next();
  if (!user) {
    req.error = receiverNotfound;
    return next();
  }
  if (req.user.id === Number(user.id)) {
    req.error = cannotSendMsgToSelf;
    return next();
  }
  req.body.receiverId = user.id;
  req.body.senderId = req.user.id;
  const msg = await dbHandler.saveMessage(req.body);
  if (msg === 500) return next();
  res.status(201).json({ status: 201, data: msg });
}, error);

/* send saved draft messages */
router.post('/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    req.error = paramIdMustBeNumber;
    return next();
  }
  const draftMsg = await dbHandler.find('messages', { id }, ['id']);
  if (draftMsg === 500) return next();
  if (draftMsg.senderid !== req.user.id) {
    req.error = notAuthorized;
    return next();
  }
  const msg = await dbHandler.sendDraftMessage(draftMsg);
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

/* patch draft and unread messages */
router.patch('/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    req.error = paramIdMustBeNumber;
    return next();
  }
  req.body.email = req.body.email.toLowerCase();
  const err = validator.updateMsgValidate(req.body).error;
  if (err) {
    req.error = { status: 400, error: err.details[0].message };
    return next();
  }
  const msg = await dbHandler.find('messages', { id }, ['id']);
  if (msg === 500) return next();
  if (!msg) {
    req.error = messageIdNotFound;
    return next();
  }
  if (msg.senderid !== req.user.id && msg.receiverid !== req.user.id) {
    req.error = notAuthorized;
    return next();
  }
  const updateMsg = await dbHandler.updateMessageById(req.body, msg);
  if (updateMsg === 500) return next();
  res.status(200).json({ status: 200, data: updateMsg });
}, error);

/* delete and retract messages */
router.delete('/:id', auth, async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    req.error = paramIdMustBeNumber;
    return next();
  }
  let msg = await dbHandler.find('messages', { id }, ['id']);
  if (msg === 500) return next();
  if (!msg) {
    req.error = messageIdNotFound;
    return next();
  }
  if (msg.receiverid !== req.user.id && msg.senderid !== req.user.id) {
    req.error = notAuthorized;
    return next();
  }
  msg = await dbHandler.deleteMessage(msg, req.user);
  if (msg === 500) return next();
  res.status(200).json({ status: 200, data: msg });
}, error);

export default router;
