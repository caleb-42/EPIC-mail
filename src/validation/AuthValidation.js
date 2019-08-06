import helper from '../utilities';

const error = err => ({
  status: 400,
  error: err.details[0].message,
});

export const signUp = async (req, res, next) => {
  const err = helper.validateSignUp(req.body).error;
  if (err) req.error = error(err);
  next();
};

export const logIn = async (req, res, next) => {
  const err = helper.validateLogIn(req.body).error;
  if (err) req.error = error(err);
  next();
};

export const sendResetLink = async (req, res, next) => {
  const err = helper.validateGroupAddUser(req.body).error;
  if (err) req.error = error(err);
  next();
};

export const checkResetLink = async (req, res, next) => {
  if (!req.query.token) {
    req.error = {
      status: 401,
      error: 'You are not authorized to view this page',
    };
  }
  next();
};
