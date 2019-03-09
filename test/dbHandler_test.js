/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import config from 'config';
import jwt from 'jsonwebtoken';
import {
  describe, it, after, beforeEach,
} from 'mocha';
import dbHandler from '../src/dbHandler';


let register;

describe('DATABASE METHODS', () => {
  beforeEach(() => {
    register = {
      email: 'ewere@gmail.com',
      firstName: 'admin',
      lastName: 'user',
      password: 'admin123',
      phoneNumber: '2348130439102',
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
    it('should return all messages if user id is valid', async () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = await dbHandler.getMessages(user.id);
      expect(res).to.be.an('array');
    });
  });
  describe('Get Recieved Messages', () => {
    it('should return all Recieved messages if user id is valid and type is not set', async () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = await dbHandler.getReceivedMessages(user.id);
      expect(res).to.be.an('array');
    });
  });
  describe('Get Sent Messages', () => {
    it('should return Sent messages if user id is valid', async () => {
      const { db } = dbHandler;
      const user = db.users[0];
      const res = await dbHandler.getSentMessages(user.id);
      expect(res).to.be.an('array');
    });
  });
});
