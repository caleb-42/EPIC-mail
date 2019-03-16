import express from 'express';
import joi from 'joi';
import auth from '../middleware/auth';
import dbHandler from '../database/dbHandler';

const router = express.Router();

const validate = (msg) => {
  const schema = {
    /* id: joi.number().equal(0), */
    receiverId: joi.number().required(),
    mailerName: joi.string().required(),
    subject: joi.string().max(32).required(),
    message: joi.string().required(),
    parentMessageId: joi.number().optional(),
  };
  return joi.validate(msg, schema);
};

router.get('/', auth, async (req, res) => {
  const { id } = req.user;
  return res.status(200).send({
    status: 200,
    data: dbHandler.getInboxMessages(id),
  });
});
router.get('/all', auth, async (req, res) => {
  const { id } = req.user;
  return res.status(200).send({
    status: 200,
    data: dbHandler.getMessages(id),
  });
});
router.get('/unread', auth, async (req, res) => {
  const { id } = req.user;
  return res.status(200).send({
    status: 200,
    data: dbHandler.getInboxMessages(id, 'unread'),
  });
});
router.get('/read', auth, async (req, res) => {
  const { id } = req.user;
  return res.status(200).send({
    status: 200,
    data: dbHandler.getInboxMessages(id, 'read'),
  });
});
router.get('/sent', auth, async (req, res) => {
  const { id } = req.user;
  return res.status(200).send({
    status: 200,
    data: dbHandler.getOutboxMessages(id, 'sent'),
  });
});
router.get('/draft', auth, async (req, res) => {
  const { id } = req.user;
  return res.status(200).send({
    status: 200,
    data: dbHandler.getOutboxMessages(id, 'draft'),
  });
});
router.get('/:id', auth, async (req, res) => {
  const msgId = parseInt(req.params.id, 10);
  const msg = dbHandler.getMessageById(msgId);
  if (!msg) {
    return res.status(404).send({
      status: 404,
      error: 'message ID does not exist',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});
router.post('/', auth, async (req, res) => {
  const { id } = req.user;
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({
      status: 400,
      error: error.details[0].message,
    });
  }
  req.body.senderId = id;
  req.body.status = 'sent';
  const msg = dbHandler.sendMessage(req.body);
  return res.status(201).send({
    status: 201,
    data: msg,
  });
});

router.put('/:id', auth, async (req, res) => {
  if (req.body.status !== 'draft') {
    return res.status(400).send({
      status: 400,
      error: 'Invalid message Type, Can only Update Draft Messages',
    });
  }
  const id = parseInt(req.params.id, 10);
  const msg = dbHandler.updateMessageById(id, req.body);
  if (!msg) {
    return res.status(404).send({
      status: 404,
      error: 'message ID does not exist',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

router.delete('/:id', auth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const msg = dbHandler.deleteMessage(id, req.user.id);
  if (!msg) {
    return res.status(404).send({
      status: 404,
      error: 'message ID does not exist',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

module.exports = router;
