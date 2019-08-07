import joi from 'joi';

export const validateMsg = (msg) => {
  const schema = {
    email: joi.string().email().trim().required(),
    subject: joi.string().trim().max(35).required(),
    message: joi.string().trim().required(),
    parentMessageId: joi.number().optional(),
    sendsms: joi.boolean().optional(),
  };
  return joi.validate(msg, schema);
};

export const updateMsgValidate = (msg) => {
  const schema = {
    email: joi.string().email().trim().optional(),
    subject: joi.string().trim().max(35).optional(),
    message: joi.string().trim().optional(),
  };
  return joi.validate(msg, schema);
};
