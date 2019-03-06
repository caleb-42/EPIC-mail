import { expect } from 'chai';
import request from 'supertest';
import {
  describe, it, beforeEach, afterEach, after,
} from 'mocha';
import dbHandler from '../../src/dbHandler';

let server;
let user;
const register = {
  email: 'ewere@gmail.com',
  firstName: 'admin',
  lastName: 'user',
  password: 'admin123',
  phoneNumber: '2348130439102',
};

describe('MAILS API ENDPOINTS', () => {
  beforeEach(() => {
    server = require('../../src/index');
    user = {
      email: 'ewere@gmail.com',
      password: 'admin123',
    };
  });
  afterEach(() => {
    server.close();
  });
  after(() => {
    dbHandler.resetDb();
  });
  describe('Get All Mails', () => {
    it('should release mails for valid user', async () => {
      let res = await request(server).post('/api/v1/users').send(register);
      res = await request(server).post('/api/v1/auth').send(user);
      const { token } = res.body.data[0];
      const messages = await request(server).get('/api/v1/mails').set('x-auth-token', token);
      /* console.log(res); */
      expect(messages.body).to.have.property('status');
      expect(messages.body.status).to.be.equal(200);
      expect(messages.body).to.have.property('data');
      expect(messages.body).to.not.have.property('error');
      expect(messages.body.data).to.be.an('array');
    });
    it('should not release mails to user with no token', async () => {
      const res = await request(server).get('/api/v1/mails');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(401);
      expect(res.body).to.have.property('error');
      expect(res.body).to.not.have.property('data');
      expect(res.body.error).to.be.a('string');
      expect(res.body.error).to.include('Access denied, no token provided');
    });
    it('should not realease mail to user with invalid token', async () => {
      const res = await request(server).get('/api/v1/mails').set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTUxODQ2MTcxfQ.ZvbKiQ7n4cX7_9PxEVfZCGyA-361nxagjkcw0XMqFsCa');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.not.have.property('data');
      expect(res.body.error).to.be.a('string');
      expect(res.body.error).to.include('Invalid token');
    });
  });
});
