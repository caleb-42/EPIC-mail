import { expect } from 'chai';
import request from 'supertest';
import dbHandler from '../../../src/database/dbHandler';

let server;
let user;
const user1 = {
  email: 'ewere@epicmail.com',
  recoveryEmail: 'ewere@gmail.com',
  firstName: 'admin',
  lastName: 'user',
  confirmPassword: 'admin123',
  password: 'admin123',
  phoneNumber: '2348130439102',
};
const user2 = {
  email: 'sam@epicmail.com',
  recoveryEmail: 'sam@gmail.com',
  firstName: 'user',
  lastName: 'user',
  confirmPassword: 'user123',
  password: 'user123',
  phoneNumber: '2348130439102',
};
const user3 = {
  email: 'kal@epicmail.com',
  recoveryEmail: 'kal@gmail.com',
  firstName: 'user',
  lastName: 'user',
  confirmPassword: 'user123',
  password: 'user123',
  phoneNumber: '2348130439102',
};
let sentMsg;
const updateMsg = {
  subject: 'i just changed again',
  email: 'sam@epicmail.com',
  message: 'its so exiting to be part of this app',
};
describe('MAILS API ENDPOINTS', () => {
  const validToken = async (endpoint) => {
    const res = await request(server).post('/api/v1/auth/signup').send(user1);
    const { token } = res.body.data[0];
    const messages = await request(server).get(endpoint).set('Cookie', [`token=${token}`]);
    expect(messages.body).to.have.property('status');
    expect(messages.body.status).to.be.equal(200);
    expect(messages.body).to.have.property('data');
    expect(messages.body).to.not.have.property('error');
    expect(messages.body.data).to.be.an('array');
  };
  const noToken = async (endpoint, method = 'get') => {
    const token = '';
    let res;
    if (method === 'get') res = await request(server).get(endpoint).set('Cookie', [`token=${token}`]);
    if (method === 'post') res = await request(server).post(endpoint).send(sentMsg).set('Cookie', [`token=${token}`]);
    if (method === 'delete') res = await request(server).delete(endpoint).set('Cookie', [`token=${token}`]);
    if (method === 'update') res = await request(server).patch(endpoint).send(updateMsg).set('Cookie', [`token=${token}`]);
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.be.equal(401);
    expect(res.body).to.have.property('error');
    expect(res.body).to.not.have.property('data');
    expect(res.body.error).to.be.a('string');
    expect(res.body.error).to.include('Access denied, no token provided');
  };
  const error = (resp, status, msg) => {
    expect(resp.status).to.be.equal(status);
    expect(resp.body).to.have.property('status');
    expect(resp.body.status).to.be.equal(status);
    expect(resp.body).to.have.property('error');
    expect(resp.body).to.not.have.property('data');
    expect(resp.body.error).to.be.a('string');
    expect(resp.body.error).to.include(msg);
  };
  const success = (resp, status) => {
    expect(resp.status).to.be.equal(status);
    expect(resp.body).to.have.property('status');
    expect(resp.body.status).to.be.equal(status);
    expect(resp.body).to.have.property('data');
    expect(resp.body).to.not.have.property('error');
    expect(resp.body.data).to.be.an('array');
  };
  beforeEach(() => {
    server = require('../../../src/index');
    user = {
      email: 'ewere@epicmail.com',
      password: 'admin123',
    };
    sentMsg = {
      subject: 'i just registered',
      email: 'sam@epicmail.com',
      message: 'its so wonderful to be part of this app',
    };
  });
  afterEach(async () => {
    await dbHandler.resetDb();
    server.close();
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
  describe('Get Single Mails by ID api/v1/messages/id', () => {
    it('should not release single mails to user with no token', async () => {
      await noToken('/api/v1/messages/1');
    });
    it('should not get mail if id param is NaN', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).get('/api/v1/messages/d').set('Cookie', [`token=${token}`]);
      error(resp, 400, 'param IDs must be numbers');
    });
    it('should not release single mails to user with no authorization', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const wrongUser = await request(server).post('/api/v1/auth/signup').send(user3);
      const wrongUserToken = wrongUser.body.data[0].token;
      const { token } = res.body.data[0];
      const sentMessage = await request(server).post('/api/v1/messages/').send(sentMsg).set('Cookie', [`token=${token}`]);
      const mgs = sentMessage.body.data[0];
      const singleMessage = await request(server).get(`/api/v1/messages/${mgs.id}`).set('Cookie', [`token=${wrongUserToken}`]);
      error(singleMessage, 401, 'you are not authorized to access this message');
    });
    it('should release single mails for valid user', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const sentMessage = await request(server).post('/api/v1/messages/').send(sentMsg).set('Cookie', [`token=${token}`]);
      const mgs = sentMessage.body.data[0];
      const singleMessage = await request(server).get(`/api/v1/messages/${mgs.id}`).set('Cookie', [`token=${token}`]);
      success(singleMessage, 200);
    });
    it('should not get single mail with invalid id', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const singleMessage = await request(server).get('/api/v1/messages/6').set('Cookie', [`token=${token}`]);
      error(singleMessage, 404, 'message ID does not exist');
    });
  });
  describe('Send mail api/v1/messages', () => {
    it('should not send mail if user has no token', async () => {
      await noToken('/api/v1/messages/', 'post');
    });
    it('should not send mail if user sends to self', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      sentMsg.email = 'ewere@epicmail.com';
      const messages = await request(server).post('/api/v1/messages/').send(sentMsg).set('Cookie', [`token=${token}`]);
      error(messages, 400, 'user cannot send message to self');
    });
    it('should not send mail if receiver id is non existent', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      sentMsg.email = 'polo@epicmail.com';
      const messages = await request(server).post('/api/v1/messages/').send(sentMsg).set('Cookie', [`token=${token}`]);
      error(messages, 404, 'receiver not found');
    });
    it('should send mail if user has valid token', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const messages = await request(server).post('/api/v1/messages/').send(sentMsg).set('Cookie', [`token=${token}`]);
      success(messages, 201);
    });
  });
  describe('Save draft mail api/v1/messages/save', () => {
    it('should not send mail if user has no token', async () => {
      await noToken('/api/v1/messages/save', 'post');
    });
    it('should not save mail if user sends to self', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      sentMsg.email = 'ewere@epicmail.com';
      const messages = await request(server).post('/api/v1/messages/save').send(sentMsg).set('Cookie', [`token=${token}`]);
      error(messages, 400, 'user cannot send message to self');
    });
    it('should not save mail if receiver id is non existent', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      sentMsg.email = 'polo@epicmail.com';
      const messages = await request(server).post('/api/v1/messages/save').send(sentMsg).set('Cookie', [`token=${token}`]);
      error(messages, 404, 'receiver not found');
    });
    it('should save mail if user has valid token', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const messages = await request(server).post('/api/v1/messages/save').send(sentMsg).set('Cookie', [`token=${token}`]);
      success(messages, 201);
    });
  });
  describe('Send draft mail api/v1/messages/:id', () => {
    it('should not send mail if user has no token', async () => {
      await noToken('/api/v1/messages/1', 'post');
    });
    it('should not get draft mail if id param is NaN', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).post('/api/v1/messages/d').send(user).set('Cookie', [`token=${token}`]);
      error(resp, 400, 'param IDs must be numbers');
    });
    it('should send draft mail if user has valid token', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const draftMsg = await request(server).post('/api/v1/messages/save').send(sentMsg).set('Cookie', [`token=${token}`]);
      /* console.log(draftMsg.body); */
      const sentDraftMsg = await request(server).post(`/api/v1/messages/${draftMsg.body.data[0].id}`).set('Cookie', [`token=${token}`]);
      success(sentDraftMsg, 200);
    });
  });
  describe('Update Single Mails by ID api/v1/messages/id', () => {
    it('should not update single mails for user with no token', async () => {
      await noToken('/api/v1/messages/1', 'update');
    });
    it('should not update single mails for invalid id', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const updatedMessage = await request(server).patch('/api/v1/messages/3').send(updateMsg).set('Cookie', [`token=${token}`]);
      error(updatedMessage, 404, 'message ID does not exist');
    });
    it('should update single mails for valid user', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const sentMessage = await request(server).post('/api/v1/messages/').send(sentMsg).set('Cookie', [`token=${token}`]);
      const mgs = sentMessage.body.data[0];
      const updatedMessage = await request(server).patch(`/api/v1/messages/${mgs.id}`).send(updateMsg).set('Cookie', [`token=${token}`]);
      success(updatedMessage, 200);
    });
  });
  describe('Delete mail api/v1/messages', () => {
    it('should not delete mail if user has no token', async () => {
      await noToken('/api/v1/messages/1', 'delete');
    });
    it('should not delete mail if id param is NaN', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).post('/api/v1/messages/d').send(user).set('Cookie', [`token=${token}`]);
      error(resp, 400, 'param IDs must be numbers');
    });
    it('should delete mail if user has valid token', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const sentMessages = await request(server).post('/api/v1/messages/').send(sentMsg).set('Cookie', [`token=${token}`]);
      const delMessage = sentMessages.body.data[0];
      const deleteMessages = await request(server).delete(`/api/v1/messages/${delMessage.id}`).set('Cookie', [`token=${token}`]);
      success(deleteMessages, 200);
      expect(deleteMessages.body.data[0].message).to.include('message has been retracted');
    });
    it('should not delete mail if message id is invalid', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const deleteMessages = await request(server)
        .delete('/api/v1/messages/4').set('Cookie', [`token=${token}`]);
      error(deleteMessages, 404, 'message ID does not exist');
    });
  });
});
