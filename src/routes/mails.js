import express from 'express';
import joi from 'joi';
import _ from 'lodash';
import auth from '../middleware/auth';
import dbHandler from '../database/dbHandler';

const router = express.Router();

const validate = (msg) => {
  const schema = {
    receiverId: joi.number().required(),
    subject: joi.string().trim().max(32).required(),
    message: joi.string().trim().required(),
    parentMessageId: joi.number().optional(),
  };
  return joi.validate(msg, schema);
};

const updateValidate = (msg) => {
  const schema = {
    id: joi.number().required(),
    receiverId: joi.number().optional(),
    subject: joi.string().trim().max(32).required(),
    message: joi.string().trim().required(),
  };
  return joi.validate(msg, schema);
};

const draftValidate = (msg) => {
  const schema = {
    receiverId: joi.number().optional(),
    subject: joi.string().trim().max(32).required(),
    message: joi.string().trim().required(),
    parentMessageId: joi.number().optional(),
  };
  return joi.validate(msg, schema);
};

router.get('/', auth, async (req, res) => {
  const { id } = req.user;
  const msg = await dbHandler.getInboxMessages(id);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});
router.get('/all', auth, async (req, res) => {
  const { id } = req.user;
  const msg = await dbHandler.getMessages(id);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

router.get('/unread', auth, async (req, res) => {
  const { id } = req.user;
  const msg = await dbHandler.getInboxMessages(id, 'unread');
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

router.get('/read', auth, async (req, res) => {
  const { id } = req.user;
  const msg = await dbHandler.getInboxMessages(id, 'read');
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

router.get('/sent', auth, async (req, res) => {
  const { id } = req.user;
  const msg = await dbHandler.getOutboxMessages(id, 'sent');
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

router.get('/draft', auth, async (req, res) => {
  const { id } = req.user;
  const msg = await dbHandler.getOutboxMessages(id, 'draft');
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

router.get('/:id', auth, async (req, res) => {
  const msgId = req.params.id;
  if (isNaN(msgId)) {
    return res.status(400).send({
      status: 400,
      error: 'param IDs must be numbers',
    });
  }
  const msg = await dbHandler.getMessageById(msgId, req.user.id);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }

  if (msg.length === 0) {
    return res.status(404).send({
      status: 404,
      error: 'message ID does not exist',
    });
  }
  if (msg[0].receiverid !== req.user.id && msg[0].senderid !== req.user.id) {
    return res.status(401).send({
      status: 401,
      error: 'you are not authorized to get this message',
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
  if (id === Number(req.body.receiverId)) {
    return res.status(400).send({
      status: 400,
      error: 'user cannot send message to self',
    });
  }
  const user = await dbHandler.find('users', req.body, 'id', 'receiverId');
  if (user === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  if (!user) {
    return res.status(404).send({
      status: 404,
      error: 'receiver not found',
    });
  }
  req.body.senderId = id;
  const msg = await dbHandler.sendMessage(req.body);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(201).send({
    status: 201,
    data: msg,
  });
});

router.post('/save', auth, async (req, res) => {
  const { id } = req.user;
  const { error } = draftValidate(req.body);
  if (error) {
    return res.status(400).send({
      status: 400,
      error: error.details[0].message,
    });
  }
  if (req.body.receiverId) {
    const user = await dbHandler.find('users', req.body, 'id', 'receiverId');
    if (user === 500) {
      return res.status(500).send({
        status: 500,
        data: 'Internal server error',
      });
    }
    if (!user) {
      return res.status(404).send({
        status: 404,
        error: 'receiver not found',
      });
    }
    if (id === req.body.receiverId && req.body.receiverId) {
      return res.status(400).send({
        status: 400,
        error: 'user cannot send message to self',
      });
    }
  }
  req.body.senderId = id;
  const msg = await dbHandler.saveMessage(req.body);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(201).send({
    status: 201,
    data: msg,
  });
});

router.post('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).send({
      status: 400,
      error: 'param IDs must be numbers',
    });
  }
  const draftMsg = await dbHandler.find('messages', { id }, 'id');
  if (draftMsg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  draftMsg.receiverId = draftMsg.receiverid;
  const { error } = validate(_.pick(draftMsg, ['receiverId', 'subject', 'message']));
  if (error) {
    return res.status(400).send({
      status: 400,
      error: error.details[0].message,
    });
  }
  const msg = await dbHandler.sendDraftMessage(draftMsg);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(201).send({
    status: 201,
    data: msg,
  });
});

router.patch('/', auth, async (req, res) => {
  const { error } = updateValidate(req.body);
  if (error) {
    return res.status(400).send({
      status: 400,
      error: error.details[0].message,
    });
  }
  const msg = await dbHandler.find('messages', req.body, 'id');
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  if (!msg) {
    return res.status(404).send({
      status: 404,
      error: 'message ID does not exist',
    });
  }
  const updateMsg = await dbHandler.updateMessageById(req.body, msg);
  if (updateMsg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: updateMsg,
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
  let msg = await dbHandler.find('messages', { id }, 'id');
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  if (!msg) {
    return res.status(404).send({
      status: 404,
      error: 'message ID does not exist',
    });
  }
  msg = await dbHandler.deleteMessage(msg, req.user);
  if (msg === 500) {
    return res.status(500).send({
      status: 500,
      data: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: msg,
  });
});

export default router;
