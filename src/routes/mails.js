import express from 'express';
import joi from 'joi';
import auth from '../middleware/auth';
import dbHandler from '../database/dbHandler';

const router = express.Router();

const validate = (msg) => {
  const schema = {
    /* id: joi.number().equal(0), */
    receiverId: joi.number().required(),
    senderId: joi.number().required(),
    mailerName: joi.string().required(),
    subject: joi.string().max(32).required(),
    message: joi.string().required(),
    parentMessageId: joi.number().optional(),
  };
  return joi.validate(msg, schema);
};

router.get('/', auth, async (req, res) => {
  const { id } = req.user;
  return res.send({
    status: 200,
    data: dbHandler.getReceivedMessages(id),
  });
});
router.get('/all', auth, async (req, res) => {
  const { id } = req.user;
  return res.send({
    status: 200,
    data: dbHandler.getMessages(id),
  });
});
router.get('/unread', auth, async (req, res) => {
  const { id } = req.user;
  return res.send({
    status: 200,
    data: dbHandler.getReceivedMessages(id, 'unread'),
  });
});
router.get('/read', auth, async (req, res) => {
  const { id } = req.user;
  return res.send({
    status: 200,
    data: dbHandler.getReceivedMessages(id, 'read'),
  });
});
router.get('/sent', auth, async (req, res) => {
  const { id } = req.user;
  return res.send({
    status: 200,
    data: dbHandler.getSentMessages(id),
  });
});
router.get('/draft', auth, async (req, res) => {
  const { id } = req.user;
  return res.send({
    status: 200,
    data: dbHandler.getDraftMessages(id),
  });
});
router.get('/:id', auth, async (req, res) => {
  const msgId = parseInt(req.params.id, 10);
  const msg = dbHandler.getMessageById(msgId);
  if (!msg) {
    return res.send({
      status: 400,
      error: 'Invalid message ID',
    });
  }
  return res.send({
    status: 200,
    data: msg,
  });
});
router.post('/', auth, async (req, res) => {
  const { id } = req.user;
  req.body.senderId = id;
  const { error } = validate(req.body);
  if (error) {
    return res.send({
      status: 400,
      error: error.details[0].message,
    });
  }
  const msg = dbHandler.sendMessage(req.body);
  return res.send({
    status: 201,
    data: msg,
  });
});

router.put('/:id', auth, async (req, res) => {
  if (req.body.status === 'read' || req.body.status === 'unread') {
    return res.send({
      status: 400,
      error: 'Invalid message Type, Can only Update sent and Draft',
    });
  }
  const id = parseInt(req.params.id, 10);
  const msg = dbHandler.updateMessageById(id, req.body);
  if (!msg) {
    return res.send({
      status: 404,
      error: 'Invalid message ID',
    });
  }
  return res.send({
    status: 200,
    data: msg,
  });
});

router.delete('/:id', auth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const msg = dbHandler.deleteMessage(id);
  if (!msg) {
    return res.send({
      status: 400,
      error: 'Invalid message ID',
    });
  }
  return res.send({
    status: 200,
    data: msg,
  });
});

module.exports = router;
