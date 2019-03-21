/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import dotenv from 'dotenv';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import dbHandler from '../../../src/database/dbHandler';

dotenv.config();

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
      const decoded = jwt.verify(res, process.env.jwtPrivateKey);
      expect(decoded).to.be.an('object');
      expect(decoded).to.have.property('id');
    });
  });
  describe('Get Contacts', () => {
    it('should return all users except current user as contacts', async () => {
      const res = await dbHandler.createUser(user2);
      const { id } = jwt.verify(res, process.env.jwtPrivateKey);
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
      expect(sentMsg).to.have.any.keys('id', 'receiverid', 'status');
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
  describe('Create Group', () => {
    it('should create group if group is valid', async () => {
      await dbHandler.resetDb();
      const res = await dbHandler.createUser(user1);
      const userToken = jwt.verify(res, process.env.jwtPrivateKey);
      const newGroup = await dbHandler.createGroup({ name: 'caleb', role: 'admin', userid: userToken.id });
      expect(newGroup).to.be.an('array');
      expect(newGroup[0]).to.have.any.keys('id', 'name', 'userid', 'role');
      expect(newGroup[0]).to.include({ name: 'caleb' });
    });
  });
  describe('Add user to Group', () => {
    it('should add user to group if user and group are valid', async () => {
      await dbHandler.resetDb();
      const res = await dbHandler.createUser(user1);
      const userToken = jwt.verify(res, process.env.jwtPrivateKey);
      const newGroup = await dbHandler.createGroup({ name: 'caleb', role: 'admin', userid: userToken.id });
      const newGroupUser = await dbHandler
        .groupAddUser({ groupid: newGroup[0].id, id: newGroup[0].userid });
      expect(newGroupUser).to.be.an('array');
      expect(newGroupUser[0]).to.have.any.keys('groupid', 'userid', 'role');
      expect(newGroupUser[0]).to.include({ userid: newGroup[0].userid });
    });
  });
  describe('Delete user from Group', () => {
    it('should delete user from group if user and group are valid', async () => {
      await dbHandler.resetDb();
      const res = await dbHandler.createUser(user1);
      const userToken = jwt.verify(res, process.env.jwtPrivateKey);
      const newGroup = await dbHandler.createGroup({ name: 'caleb', role: 'admin', userid: userToken.id });
      await dbHandler.groupAddUser({ groupid: newGroup[0].id, id: newGroup[0].userid });
      const groupuser = await dbHandler.find('users', { id: userToken.id }, 'id');
      const deleteGroupUser = await dbHandler
        .groupDeleteUser(groupuser, newGroup[0]);
      expect(deleteGroupUser).to.be.a('array');
      expect(deleteGroupUser[0]).to.have.any.keys('messages');
    });
  });
  describe('Send Message to group', () => {
    it('should return mail sent if message is valid', async () => {
      await dbHandler.resetDb();
      await dbHandler.createUser(user1);
      await dbHandler.createUser(user2);
      const newGroup = await dbHandler.createGroup({ name: 'caleb', role: 'admin', userid: 2 });
      await dbHandler.groupAddUser({ groupid: newGroup[0].id, id: 1 });
      msg.groupid = newGroup[0].id;
      const resp = await dbHandler.groupSendMsg(msg);
      expect(resp).to.be.an('array');
      expect(resp[0]).to.have.any.keys('id', 'receiverid', 'status');
    });
  });
  describe('Get all groups', () => {
    it('should return all groups if user id is valid', async () => {
      await dbHandler.resetDb();
      await dbHandler.createUser(user1);
      await dbHandler.createGroup({ name: 'caleb', role: 'admin', userid: 1 });
      const res = await dbHandler.getGroups(1);
      expect(res).to.be.an('array');
      expect(res).to.have.lengthOf(1);
    });
  });
  describe('Patch group name', () => {
    it('should return new name if user and name is valid', async () => {
      await dbHandler.resetDb();
      await dbHandler.createUser(user1);
      const newGroup = await dbHandler.createGroup({ name: 'caleb', role: 'admin', userid: 1 });
      const updateGroup = { name: 'sam' };
      const resp = await dbHandler.updateGroupById(newGroup[0].id, updateGroup);
      expect(resp).to.be.an('array');
      expect(resp[0]).to.have.any.keys('id', 'name');
    });
  });
});
