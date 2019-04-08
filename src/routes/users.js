import express from 'express';
import dbHandler from '../database/dbHandler';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/contacts', auth, async (req, res) => {
  const users = await dbHandler.getUsers(req.user.id);
  if (users === 500) {
    return res.status(500).send({
      status: 500,
      error: 'Internal server error',
    });
  }
  return res.status(200).send({
    status: 200,
    data: users,
  });
});

module.exports = router;
