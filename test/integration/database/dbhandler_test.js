/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
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
});
