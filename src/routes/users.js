import express from 'express';
import multer from 'multer';
import date from 'date-and-time';
import dbHandler from '../database/dbHandler';
import error from '../middleware/error';
import auth from '../middleware/auth';
import utilities from '../utilities';

const router = express.Router();
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true);
  else cb(null, false);
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    /* console.log(file); */
    cb(null, date.format(new Date(), 'YYYY-MM-DD') + file.originalname);
  },
});
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter });

router.get('/contacts', auth, async (req, res, next) => {
  const users = await dbHandler.getUsers(req.user.id);
  if (users === 500) return next();
  return res.status(200).json({ status: 200, data: users });
}, error);

router.patch('/save', auth, upload.single('userDp'), async (req, res, next) => {
  const newInfo = {};
  if (!req.file) {
    const err = utilities.validateUserUpdate(req.body).error;
    console.log(err);
    if (err) {
      req.error = { status: 400, error: err.details[0].message };
      return next();
    }
    newInfo.password = req.body.password;
  }
  if (req.file) {
    const path = `https://epic-mail-application.herokuapp.com/${req.file.destination}${req.file.filename}`;
    /* const path = `http://localhost:3000/${req.file.destination}${req.file.filename}`; */
    newInfo.dp = path;
  }
  const users = await dbHandler.updateUser(req.user.id, newInfo);
  console.log(users);
  if (users === 500) return next();
  return res.status(200).json({ status: 200, data: users });
}, error);

module.exports = router;
