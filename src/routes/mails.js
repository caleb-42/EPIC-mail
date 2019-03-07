import express from 'express';
import auth from '../middleware';
import dbHandler from '../dbHandler';

const router = express.Router();

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
    data: dbHandler.getReceivedMessages(id),
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
  return res.send({
    status: 200,
    data: [dbHandler.getMessageById(msgId)],
  });
});

module.exports = router;
