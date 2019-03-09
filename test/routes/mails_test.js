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
  const validToken = async (endpoint) => {
    let res = await request(server).post('/api/v1/users').send(register);
    res = await request(server).post('/api/v1/auth').send(user);
    const { token } = res.body.data[0];
    const messages = await request(server).get(endpoint).set('x-auth-token', token);
    expect(messages.body).to.have.property('status');
    expect(messages.body.status).to.be.equal(200);
    expect(messages.body).to.have.property('data');
    expect(messages.body).to.not.have.property('error');
    expect(messages.body.data).to.be.an('array');
  };
  beforeEach(() => {
    server = require('../../src/index');
    user = {
      email: 'ewere@gmail.com',
      password: 'admin123',
    };
  });
  afterEach(() => {
    dbHandler.resetDb();
    server.close();
  });
  after(() => {
    dbHandler.resetDb();
  });
  describe('Get All Mails api/v1/messages/all', () => {
    it('should release mails for valid user', async () => {
      await validToken('/api/v1/messages/all');
    });
  });
  describe('Get Received Mails api/v1/messages', () => {
    it('should release received mails for valid user', async () => {
      await validToken('/api/v1/messages');
    });
  });
  describe('Get Unread Mails api/v1/messages/unread', () => {
    it('should release unread mails for valid user', async () => {
      await validToken('/api/v1/messages/unread');
    });
  });
  describe('Get Read Mails api/v1/messages/read', () => {
    it('should realease read mails for valid user', async () => {
      await validToken('/api/v1/messages/read');
    });
  });
  describe('Get Sent Mails api/v1/messages/sent', () => {
    it('should realease sent mails for valid user', async () => {
      await validToken('/api/v1/messages/sent');
    });
  });
  describe('Get Draft Mails api/v1/messages/draft', () => {
    it('should release draft mails for valid user', async () => {
      await validToken('/api/v1/messages/draft');
    });
  });
});
