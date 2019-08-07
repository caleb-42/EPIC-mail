import joi from 'joi';

export const validateGroupAddUser = (user) => {
  const schema = {
    email: joi.string().email().trim().required(),
  };
  return joi.validate(user, schema);
};

export const validateGroupSendMessage = (msg) => {
  const schema = {
    subject: joi.string().trim().max(32).required(),
    message: joi.string().trim().required(),
    parentMessageId: joi.number().optional(),
  };
  return joi.validate(msg, schema);
};
