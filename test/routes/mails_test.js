import { expect } from 'chai';
import request from 'supertest';
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
  const noToken = async (endpoint) => {
    const token = '';
    const res = await request(server).get(endpoint).set('x-auth-token', token);
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.be.equal(401);
    expect(res.body).to.have.property('error');
    expect(res.body).to.not.have.property('data');
    expect(res.body.error).to.be.a('string');
    expect(res.body.error).to.include('Access denied, no token provided');
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
    it('should not release mails to user with no token', async () => {
      await noToken('/api/v1/messages/all');
    });
    it('should release mails for valid user', async () => {
      await validToken('/api/v1/messages/all');
    });
  });
  describe('Get Received Mails api/v1/messages', () => {
    it('should not release received mails to user with no token', async () => {
      await noToken('/api/v1/messages');
    });
    it('should release received mails for valid user', async () => {
      await validToken('/api/v1/messages');
    });
  });
  describe('Get Unread Mails api/v1/messages/unread', () => {
    it('should not release unread mails to user with no token', async () => {
      await noToken('/api/v1/messages/unread');
    });
    it('should release unread mails for valid user', async () => {
      await validToken('/api/v1/messages/unread');
    });
  });
  describe('Get Read Mails api/v1/messages/read', () => {
    it('should not realease read mails to user with no token', async () => {
      await noToken('/api/v1/messages/read');
    });
    it('should realease read mails for valid user', async () => {
      await validToken('/api/v1/messages/read');
    });
  });
  describe('Get Sent Mails api/v1/messages/sent', () => {
    it('should not realease sent mails to user with no token', async () => {
      await noToken('/api/v1/messages/sent');
    });
    it('should realease sent mails for valid user', async () => {
      await validToken('/api/v1/messages/sent');
    });
  });
  describe('Get Draft Mails api/v1/messages/draft', () => {
    it('should not release draft mails to user with no token', async () => {
      await noToken('/api/v1/messages/draft');
    });
    it('should release draft mails for valid user', async () => {
      await validToken('/api/v1/messages/draft');
    });
  });
});
