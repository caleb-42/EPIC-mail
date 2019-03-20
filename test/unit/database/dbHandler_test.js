/* eslint-disable no-unused-expressions */
/* import { expect } from 'chai';
import config from 'config';
import jwt from 'jsonwebtoken';
import dbHandler from '../../../src/database/dbHandler';


let user1;
let user2;
let msg;
let sentMsg;

describe('DATABASE METHODS', () => {
  beforeEach(() => {
    user1 = {
      email: 'ewere@gmail.com',
      firstName: 'admin',
      lastName: 'user',
      confirmPassword: 'admin123',
      password: 'admin123',
      phoneNumber: '2348130439102',
    };
    user2 = {
      email: 'sam@gmail.com',
      firstName: 'sam',
      lastName: 'user',
      confirmPassword: 'user123',
      password: 'user123',
      phoneNumber: '2348130439102',
    };
    msg = {
      senderId: 2,
      receiverId: 1,
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
      const res = await dbHandler.createUser(user1);
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
  describe('Get Contacts', () => {
    it('should return all users except current user as contacts', async () => {
      const res = await dbHandler.createUser(user2);
      const { id } = jwt.verify(res, config.get('jwtPrivateKey'));
      const contacts = dbHandler.getUsers(id);
      expect(contacts).to.be.an('array');
      expect(contacts).to.have.lengthOf(1);
    });
  });
  describe('Validate User', () => {
    it('should return valid token if user password is correct', async () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = await dbHandler.validateUser(user1, user);
      expect(res).to.be.a('string');
      const decoded = jwt.verify(res, config.get('jwtPrivateKey'));
      expect(decoded).to.be.an('object');
      expect(decoded).to.have.property('id');
    });
    it('should return false if user password is incorrect', async () => {
      user1.password = 'wrong';
      const { db } = dbHandler;
      const user = db.users[0];
      const res = await dbHandler.validateUser(user1, user);
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
      const res = dbHandler.getInboxMessages(user.id);
      expect(res).to.be.an('array');
    });
  });
  describe('Get Sent Messages', () => {
    it('should return Sent messages if user id is valid', () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = dbHandler.getOutboxMessages(user.id, 'sent');
      expect(res).to.be.an('array');
    });
  });
  describe('Get Draft Messages', () => {
    it('should return Draft messages if user id is valid', () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = dbHandler.getOutboxMessages(user.id, 'draft');
      expect(res).to.be.an('array');
    });
  });
  describe('Send Message', () => {
    it('should return mail sent if message is valid', () => {
      const res = dbHandler.sendMessage(msg);
      expect(res).to.be.an('array');
      [sentMsg] = res;
      expect(sentMsg).to.have.any.keys('messageId', 'id', 'receiverId', 'status');
      expect(sentMsg).to.include(msg);
    });
    it('should add new message to Database for valid message', () => {
      const { db } = dbHandler;
      const allMessageArray = db.messages;
      const sentmessageArray = db.outbox;
      const receivedmessageArray = db.inbox;
      const message = allMessageArray[0];
      const sentMessage = sentmessageArray[0];
      const receivedMessage = receivedmessageArray[0];
      expect(allMessageArray).to.have.lengthOf(1);
      expect(sentmessageArray).to.have.lengthOf(1);
      expect(receivedmessageArray).to.have.lengthOf(1);
      expect(message).to.include(msg);
      expect(sentMessage).to.have.any.keys('messageId');
      expect(receivedMessage).to.have.any.keys('messageId');
      expect(sentMessage.status).to.be.equal('sent');
      expect(receivedMessage.status).to.be.equal('unread');
    });
  });
  describe('Single Message', () => {
    it('should not return single mail with invalid id', () => {
      const res = dbHandler.getMessageById(7);
      expect(res).to.be.false;
    });
    it('should return single mail for valid user', () => {
      const res = dbHandler.getMessageById(1);
      expect(res).to.be.an('array');
      expect(res[0]).to.have.any.keys('message', 'id');
      expect(res[0]).to.include(msg);
    });
  });
  describe('Update Message by Id', () => {
    it('should not update message with invalid id', () => {
      const res = dbHandler.updateMessageById(7, {});
      expect(res).to.include('empty');
    });
    it('should return updated mail for valid user', () => {
      sentMsg.subject = 'I have Changed';
      const res = dbHandler.updateMessageById(1, sentMsg);
      expect(res).to.be.an('array');
      expect(res[0]).to.have.any.keys('message', 'id', 'subject');
    });
  });
  describe('Delete Message', () => {
    it('should not delete mail with invalid id', () => {
      const res = dbHandler.deleteMessage(7);
      expect(res).to.be.false;
    });
    it('should delete mail for valid user', () => {
      const res = dbHandler.deleteMessage(1, msg.senderId);
      expect(res).to.be.an('array');
      expect(res[0]).to.have.any.keys('message');
      expect(msg).to.include(res[0]);
    });
    it('should remove sent message from Database after sent message deleted', () => {
      const { db } = dbHandler;
      const sentmessageArray = db.outbox;
      const receivedmessageArray = db.inbox;
      const allMessageArray = db.messages;
      expect(receivedmessageArray).to.have.lengthOf(0);
      expect(sentmessageArray).to.have.lengthOf(1);
      expect(allMessageArray).to.have.lengthOf(1);
      expect(sentmessageArray[0].status).to.be.equal('draft');
    });
    it('should remove draft message from Database after draft message delete', () => {
      dbHandler.deleteMessage(1, msg.senderId);
      const { db } = dbHandler;
      const allMessageArray = db.messages;
      const sentmessageArray = db.outbox;
      expect(allMessageArray).to.have.lengthOf(0);
      expect(sentmessageArray).to.have.lengthOf(0);
    });
  });
  describe('Save Message', () => {
    it('should return mail draft if message is valid', () => {
      msg.status = 'draft';
      const res = dbHandler.saveMessage(msg);
      expect(res).to.be.an('array');
      const [draftMsg] = res;
      expect(draftMsg).to.have.any.keys('messageId', 'id', 'status');
      expect(draftMsg).to.include(msg);
    });
    it('should add new message to Database for valid message', () => {
      msg.status = 'draft';
      const { db } = dbHandler;
      const allMessageArray = db.messages;
      const draftmessageArray = db.outbox;
      const receivedmessageArray = db.inbox;
      const message = allMessageArray[0];
      const draftMessage = draftmessageArray[0];
      expect(allMessageArray).to.have.lengthOf(1);
      expect(draftmessageArray).to.have.lengthOf(1);
      expect(receivedmessageArray).to.have.lengthOf(0);
      expect(message).to.include(msg);
      expect(draftMessage).to.have.any.keys('messageId');
      expect(draftMessage.status).to.be.equal('draft');
    });
  });
  describe('Send Draft Message', () => {
    it('should return mail sent if message is valid', () => {
      dbHandler.resetDb();
      const saveres = dbHandler.saveMessage(msg);
      const res = dbHandler.sendDraftMessage(saveres[0]);
      expect(res).to.be.an('array');
      const [draftMsg] = res;
      expect(draftMsg).to.have.any.keys('messageId', 'id');
      expect(draftMsg).to.include(msg);
    });
    it('should add new message to inbox Database for valid message', () => {
      const { db } = dbHandler;
      const allMessageArray = db.messages;
      const sentmessageArray = db.outbox;
      const receivedmessageArray = db.inbox;
      const message = allMessageArray[0];
      const sentMessage = sentmessageArray[0];
      const receivedMessage = receivedmessageArray[0];
      expect(allMessageArray).to.have.lengthOf(1);
      expect(sentmessageArray).to.have.lengthOf(1);
      expect(receivedmessageArray).to.have.lengthOf(1);
      expect(message).to.include(msg);
      expect(sentMessage).to.have.any.keys('messageId');
      expect(receivedMessage).to.have.any.keys('messageId');
      expect(sentMessage.status).to.be.equal('sent');
      expect(receivedMessage.status).to.be.equal('unread');
    });
  });
}); */
