import joi from 'joi';

const validateUserUpdate = (user) => {
  const schema = {
    password: joi.string().trim().min(5).max(255)
      .required(),
    confirmPassword: joi.any().valid(joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match with password' } } }),
  };
  return joi.validate(user, schema);
};

export default validateUserUpdate;
