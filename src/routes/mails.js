import express from 'express';
import winston from 'winston';
import auth from '../middleware';
import dbHandler from '../dbHandler';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { id } = req.user.id;
  winston.info(id);
  return res.send({
    status: 200,
    data: dbHandler.getMessages(id),
  });
});

module.exports = router;
