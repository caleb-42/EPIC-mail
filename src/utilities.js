import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import joi from 'joi';
import twilio from 'twilio';
import naijaMobile from 'naija-phone-number';

dotenv.config();

const helpers = {

  generateJWT: user => jwt.sign({ id: user.id }, process.env.jwtPrivateKey),

  validateMsg: (msg) => {
    const schema = {
      email: joi.string().email().trim().required(),
      subject: joi.string().trim().max(35).required(),
      message: joi.string().trim().required(),
      parentMessageId: joi.number().optional(),
      sendsms: joi.boolean().optional(),
    };
    return joi.validate(msg, schema);
  },

  updateMsgValidate: (msg) => {
    const schema = {
      email: joi.string().email().trim().optional(),
      subject: joi.string().trim().max(35).optional(),
      message: joi.string().trim().optional(),
    };
    return joi.validate(msg, schema);
  },

  validateGroup: (user) => {
    const schema = {
      name: joi.string().required(),
    };
    return joi.validate(user, schema);
  },

  validateGroupAddUser: (user) => {
    const schema = {
      email: joi.string().email().trim().required(),
    };
    return joi.validate(user, schema);
  },

  validateGroupSendMessage: (msg) => {
    const schema = {
      subject: joi.string().trim().max(32).required(),
      message: joi.string().trim().required(),
      parentMessageId: joi.number().optional(),
    };
    return joi.validate(msg, schema);
  },

  validateLogIn: (user) => {
    const schema = {
      /* id: joi.number().equal(0), */
      email: joi.string().email().required(),
      password: joi.string().min(5).max(255).required(),
    };
    return joi.validate(user, schema);
  },

  validateSignUp: (user) => {
    const schema = {
      firstName: joi.string().trim().min(3).max(15)
        .required(),
      lastName: joi.string().trim().min(3).max(15)
        .required(),
      email: joi.string().trim().email().required(),
      recoveryEmail: joi.string().trim().email().optional(),
      phoneNumber: joi.number().required(),
      password: joi.string().trim().min(5).max(255)
        .required(),
      confirmPassword: joi.any().valid(joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match with password' } } }),
    };
    return joi.validate(user, schema);
  },

  validateUserUpdate: (user) => {
    const schema = {
      password: joi.string().trim().min(5).max(255)
        .required(),
      confirmPassword: joi.any().valid(joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match with password' } } }),
    };
    return joi.validate(user, schema);
  },

  sendsms: async (phoneNumber, req) => {
    if (!naijaMobile.isValid(phoneNumber)) return false;
    const stripZero = phoneNumber.substring(1);
    /* console.log(process.env.twilioAccountSid, process.env.twilioAuthToken); */
    const accountSid = process.env.twilioAccountSid;
    const authToken = process.env.twilioAuthToken;
    const client = twilio(accountSid, authToken);
    try {
      const msgRes = await client.messages
        .create({
          body: `${req.subject} - ${req.message}`,
          from: '+16572075039',
          to: `+234${stripZero}`,
        });
      return true;
    } catch (e) {
      console.log(e);
    }
  },

};

export default helpers;
