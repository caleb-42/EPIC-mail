import joi from 'joi';

const validateGroup = (user) => {
  const schema = {
    name: joi.string().required(),
  };
  return joi.validate(user, schema);
};

export default validateGroup;
