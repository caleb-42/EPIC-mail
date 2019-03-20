/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import config from 'config';
import _ from 'lodash';
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
      subject: "get in the car, you're late",
      message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      parentMessageId: undefined,
    };
  });
  after(async () => {
    await dbHandler.resetDb();
  });
  describe('Create User', () => {
    it('should return valid token if new user infomation is valid ', async () => {
      const res = await dbHandler.createUser(user1);
      expect(res).to.be.a('string');
      const decoded = jwt.verify(res, config.get('jwtPrivateKey'));
      expect(decoded).to.be.an('object');
      expect(decoded).to.have.property('id');
    });
  });
  describe('Get Contacts', () => {
    it('should return all users except current user as contacts', async () => {
      const res = await dbHandler.createUser(user2);
      const { id } = jwt.verify(res, config.get('jwtPrivateKey'));
      const contacts = await dbHandler.getUsers(id);
      expect(contacts).to.be.an('array');
      expect(contacts).to.have.lengthOf(1);
    });
  });
  describe('Send Message', () => {
    it('should return mail sent if message is valid', async () => {
      const res = await dbHandler.sendMessage(msg);
      expect(res).to.be.an('array');
      [sentMsg] = res;
      expect(sentMsg).to.have.any.keys('messageid', 'id', 'receiverid', 'status');
    });
  });
  describe('Get all Messages', () => {
    it('should return all messages if user id is valid', async () => {
      const user = await dbHandler.find('users', { id: 1 }, 'id');
      const res = await dbHandler.getMessages(user.id);
      expect(res).to.be.an('array');
      expect(res).to.have.lengthOf(1);
    });
  });
  describe('Get Sent Messages', () => {
    it('should return Sent messages if user id is valid', async () => {
      const user = await dbHandler.find('users', { id: 2 }, 'id');
      const res = await dbHandler.getOutboxMessages(user.id, 'sent');
      expect(res).to.be.an('array');
      expect(res).to.have.lengthOf(1);
    });
  });
  describe('Get Recieved Messages', () => {
    it('should return all Recieved messages if user id is valid and type is not set', async () => {
      const user = await dbHandler.find('users', { id: 1 }, 'id');
      const res = await dbHandler.getInboxMessages(user.id);
      expect(res).to.be.an('array');
      expect(res).to.have.lengthOf(1);
    });
  });
  describe('Single Message', () => {
    it('should not return single mail with invalid id', async () => {
      const res = await dbHandler.getMessageById(7);
      expect(res).to.be.an('array');
      expect(res).to.have.lengthOf(0);
    });
    it('should return single mail for valid user', async () => {
      const res = await dbHandler.getMessageById(1);
      expect(res).to.be.an('array');
      expect(res[0]).to.have.any.keys('message', 'id');
    });
  });
  describe('Update Message by Id', () => {
    it('should return updated mail for valid user', async () => {
      const updateMsg = _.cloneDeep(sentMsg);
      updateMsg.subject = 'I have Changed';
      const res = await dbHandler.updateMessageById(updateMsg, sentMsg);
      expect(res).to.be.an('array');
      expect(res[0]).to.have.any.keys('message', 'id', 'subject');
    });
  });
  describe('Delete Message', () => {
    it('should delete mail for valid user', async () => {
      const user = { id: sentMsg.senderid };
      const res = await dbHandler.deleteMessage(sentMsg, user);
      expect(res).to.be.an('array');
      expect(res[0]).to.have.any.keys('message');
      expect(msg).to.include(res[0]);
    });
  });
  describe('Save Message', () => {
    it('should return mail draft if message is valid', async () => {
      msg.status = 'draft';
      const res = await dbHandler.saveMessage(msg);
      expect(res).to.be.an('array');
      const [draftMsg] = res;
      expect(draftMsg).to.have.any.keys('messageId', 'id', 'status');
    });
  });
  describe('Get Draft Messages', () => {
    it('should return Draft messages if user id is valid', async () => {
      const user = await dbHandler.find('users', { id: 2 }, 'id');
      const res = await dbHandler.getOutboxMessages(user.id, 'draft');
      expect(res).to.be.an('array');
      expect(res).to.have.lengthOf(2);
    });
  });
  describe('Send Draft Message', () => {
    it('should return mail sent if message is valid', async () => {
      await dbHandler.resetDb();
      await dbHandler.createUser(user1);
      await dbHandler.createUser(user2);
      const saveres = await dbHandler.saveMessage(msg);
      const res = await dbHandler.sendDraftMessage(saveres[0]);
      expect(res).to.be.an('array');
      const [draftMsg] = res;
      expect(draftMsg).to.have.any.keys('id');
    });
  });
});
