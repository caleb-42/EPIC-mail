import { expect } from 'chai';
import config from 'config';
import jwt from 'jsonwebtoken';
import {
  describe, it, after,
} from 'mocha';
import dbHandler from '../src/dbHandler';

const register = {
  email: 'ewere@gmail.com',
  firstName: 'admin',
  lastName: 'user',
  password: 'admin123',
  phoneNumber: '2348130439102',
};

describe('DATABASE METHODS', () => {
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
      dbHandler.resetDb();
    });
  });
});
