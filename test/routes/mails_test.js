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
const sentMsg = {
  subject: 'i just registered',
  receiverId: 2,
  mailerName: 'paul jekande',
  message: 'its so wonderful to be part of this app',
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
  const noToken = async (endpoint, method = 'get') => {
    const token = '';
    let res;
    if (method === 'get') res = await request(server).get(endpoint).set('x-auth-token', token);
    if (method === 'post') res = await request(server).post(endpoint).send(sentMsg).set('x-auth-token', token);
    if (method === 'delete') res = await request(server).delete(endpoint).set('x-auth-token', token);
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
  /* after(() => {
    dbHandler.resetDb();
  }); */
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
  describe('Send mail api/v1/messages', () => {
    it('should not send mail if user has no token', async () => {
      await noToken('/api/v1/messages/', 'post');
    });
    it('should send mail if user has valid token', async () => {
      let res = await request(server).post('/api/v1/users').send(register);
      res = await request(server).post('/api/v1/auth').send(user);
      const { token } = res.body.data[0];
      const messages = await request(server).post('/api/v1/messages/').send(sentMsg).set('x-auth-token', token);
      expect(messages.body).to.have.property('status');
      expect(messages.body.status).to.be.equal(201);
      expect(messages.body).to.have.property('data');
      expect(messages.body).to.not.have.property('error');
      expect(messages.body.data).to.be.an('array');
      expect(messages.body.data[0]).to.include(sentMsg);
    });
  });
  describe('Delete mail api/v1/messages', () => {
    it('should not delete mail if user has no token', async () => {
      await noToken('/api/v1/messages/1', 'delete');
    });
    it('should delete mail if user has valid token', async () => {
      let res = await request(server).post('/api/v1/users').send(register);
      res = await request(server).post('/api/v1/auth').send(user);
      const { token } = res.body.data[0];
      const sentMessages = await request(server).post('/api/v1/messages/').send(sentMsg).set('x-auth-token', token);
      const delMessage = sentMessages.body.data[0];
      const deleteMessages = await request(server).delete(`/api/v1/messages/${delMessage.id}`).set('x-auth-token', token);
      expect(deleteMessages.body).to.have.property('status');
      expect(deleteMessages.body.status).to.be.equal(200);
      expect(deleteMessages.body).to.have.property('data');
      expect(deleteMessages.body).to.not.have.property('error');
      expect(deleteMessages.body.data).to.be.an('array');
      expect(sentMsg).to.include(deleteMessages.body.data[0]);
    });
  });
});
