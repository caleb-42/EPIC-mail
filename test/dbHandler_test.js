/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import config from 'config';
import jwt from 'jsonwebtoken';
import dbHandler from '../src/dbHandler';


let register;
let sentMsg;

describe('DATABASE METHODS', () => {
  beforeEach(() => {
    register = {
      email: 'ewere@gmail.com',
      firstName: 'admin',
      lastName: 'user',
      password: 'admin123',
      phoneNumber: '2348130439102',
    };
    sentMsg = {
      senderId: 2,
      mailerName: 'fred delight',
      subject: "get in the car, you're late",
      message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      parentMessageId: undefined,
    };
  });
  after(() => {
    dbHandler.resetDb();
  });
  describe('Create User', () => {
    it('should return valid token if new user infomation is valid ', async () => {
      const res = await dbHandler.createUser(register);
      expect(res).to.be.a('string');
      const decoded = jwt.verify(res, config.get('jwtPrivateKey'));
      expect(decoded).to.be.an('object');
      expect(decoded).to.have.property('id');
    });
    it('should create a new entry in the database', async () => {
      const { db } = dbHandler;
      const userArray = db.users;
      expect(userArray).to.have.lengthOf(1);
      const user = db.users[0];
      expect(user).to.have.any.keys('id', 'email', 'firstName', 'lastName', 'password', 'phoneNumber');
    });
  });
  describe('Validate User', () => {
    it('should return valid token if user password is correct', async () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = await dbHandler.validateUser(register, user);
      expect(res).to.be.a('string');
      const decoded = jwt.verify(res, config.get('jwtPrivateKey'));
      expect(decoded).to.be.an('object');
      expect(decoded).to.have.property('id');
    });
    it('should return false if user password is incorrect', async () => {
      register.password = 'wrong';
      const { db } = dbHandler;
      const user = db.users[0];
      const res = await dbHandler.validateUser(register, user);
      expect(res).to.be.false;
    });
  });
  describe('Get all Messages', () => {
    it('should return all messages if user id is valid', () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = dbHandler.getMessages(user.id);
      expect(res).to.be.an('array');
    });
  });
  describe('Get Recieved Messages', () => {
    it('should return all Recieved messages if user id is valid and type is not set', () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = dbHandler.getReceivedMessages(user.id);
      expect(res).to.be.an('array');
    });
  });
  describe('Get Sent Messages', () => {
    it('should return Sent messages if user id is valid', () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = dbHandler.getSentMessages(user.id);
      expect(res).to.be.an('array');
    });
  });
  describe('Get Draft Messages', () => {
    it('should return Draft messages if user id is valid', () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = dbHandler.getDraftMessages(user.id);
      expect(res).to.be.an('array');
    });
  });
  describe('Send Message', () => {
    it('should return mail sent if message is valid', () => {
      const res = dbHandler.sendMessage(sentMsg);
      expect(res).to.be.an('array');
      expect(res[0]).to.have.any.keys('messageId', 'id', 'receiverId', 'status');
      expect(res[0]).to.include(sentMsg);
    });
    it('should add new message to Database for valid message', () => {
      const { db } = dbHandler;
      const allMessageArray = db.messages;
      const sentmessageArray = db.sent;
      const message = allMessageArray[0];
      const sentMessage = sentmessageArray[0];
      expect(allMessageArray).to.have.lengthOf(1);
      expect(sentmessageArray).to.have.lengthOf(1);
      expect(message).to.include(sentMsg);
      expect(sentMessage).to.have.any.keys('messageId');
    });
  });
});
