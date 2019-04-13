import express from 'express';
import dbHandler from '../database/dbHandler';
import error from '../middleware/error';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/contacts', auth, async (req, res, next) => {
  const users = await dbHandler.getUsers(req.user.id);
  if (users === 500) return next();
  return res.status(200).json({ status: 200, data: users });
}, error);

module.exports = router;
