import express from 'express';
import error from '../middleware/error';
import * as Controller from '../controller/AuthCtrl';
import * as Validator from '../validation/AuthValidation';

const router = express.Router();


router.post('/login', Validator.logIn, Controller.logIn, error);

router.post('/signup', Validator.signUp, Controller.signUp, error);

router.post('/reset', Validator.sendResetLink, Controller.sendResetLink, error);

router.get('/reset', Validator.checkResetLink, Controller.checkResetLink, error);

export default router;
