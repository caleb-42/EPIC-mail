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
  firstName: 'sam',
  lastName: 'user',
  confirmPassword: 'sam123',
  password: 'sam123',
  phoneNumber: '2348130439102',
};

const sentMsg = {
  subject: 'i just registered',
  message: 'its so wonderful to be part of this app',
};
describe('GROUPS API ENDPOINTS', () => {
  const noToken = async (endpoint, method = 'get') => {
    const token = '';
    let res;
    if (method === 'get') res = await request(server).get(endpoint).set('Cookie', [`token=${token}`]);
    if (method === 'post') res = await request(server).post(endpoint).send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
    if (method === 'delete') res = await request(server).delete(endpoint).set('Cookie', [`token=${token}`]);
    if (method === 'update') res = await request(server).patch(endpoint).send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
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
  });
  afterEach(async () => {
    await dbHandler.resetDb();
    server.close();
  });
  describe('Create group api/v1/groups', () => {
    it('should not create group if user has no token', async () => {
      await noToken('/api/v1/groups/', 'post');
    });
    it('should not create group if group name already exist', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      const resp = await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      error(resp, 400, 'Group already registered');
    });
    it('should create group if user has valid token and group exist', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      success(resp, 201);
    });
  });

  describe('Add user to group api/v1/groups/:id/users', () => {
    it('should not add user to group if user has no token', async () => {
      await noToken('/api/v1/groups/1/users', 'post');
    });
    it('should not add user to group if id param is NaN', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).post('/api/v1/groups/d/users').send(user).set('Cookie', [`token=${token}`]);
      error(resp, 400, 'param IDs must be numbers');
    });
    it('should not add user to a group if new group user ID is not valid', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).post('/api/v1/groups/1/users').send({ email: 'john@epicmail.com' }).set('Cookie', [`token=${token}`]);
      error(resp, 404, 'User ID does not exist');
    });
    it('should not add user to a group if new user is already in group', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      await request(server).post('/api/v1/groups/1/users').send({ email: 'sam@epicmail.com' }).set('Cookie', [`token=${token}`]);
      const resp = await request(server).post('/api/v1/groups/1/users').send({ email: 'sam@epicmail.com' }).set('Cookie', [`token=${token}`]);
      error(resp, 400, 'User Already in group');
    });
    it('should not add admin user of group to a group', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      await request(server).post('/api/v1/groups/1/users').send({ email: 'ewere@epicmail.com' }).set('Cookie', [`token=${token}`]);
      const resp = await request(server).post('/api/v1/groups/1/users').send({ email: 'ewere@epicmail.com' }).set('Cookie', [`token=${token}`]);
      error(resp, 400, 'You cannot be a member of a group you created');
    });
    it('should not add user to a group if group name does not  exist', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const resp = await request(server).post('/api/v1/groups/1/users').send({ email: 'sam@epicmail.com' }).set('Cookie', [`token=${token}`]);
      error(resp, 404, 'Group ID does not exist');
    });
    it('should create group if user has valid token and group exist', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      const resp = await request(server).post('/api/v1/groups/1/users').send({ email: 'sam@epicmail.com' }).set('Cookie', [`token=${token}`]);
      success(resp, 201);
    });
  });

  describe('delete user from group api/v1/groups/:id/users/:userid', () => {
    it('should not create group if user has no token', async () => {
      await noToken('/api/v1/groups/1/users/1', 'delete');
    });
    it('should not delete user from group if id param is NaN', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).delete('/api/v1/groups/d/users/k').set('Cookie', [`token=${token}`]);
      error(resp, 400, 'param IDs must be numbers');
    });
    it('should not delete user from a group if user ID is not valid', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      const resp = await request(server).delete('/api/v1/groups/1/users/2').set('Cookie', [`token=${token}`]);
      error(resp, 404, 'User ID does not exist in group');
    });
    it('should not delete user from a group if group ID is non existent', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).delete('/api/v1/groups/1/users/1').set('Cookie', [`token=${token}`]);
      error(resp, 404, 'Group ID does not exist');
    });
    it('should delete user from a group if user and group ID is valid', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      await request(server).post('/api/v1/groups/1/users').send({ email: 'sam@epicmail.com' }).set('Cookie', [`token=${token}`]);
      const resp = await request(server).delete('/api/v1/groups/1/users/2').set('Cookie', [`token=${token}`]);
      success(resp, 200);
    });
  });
  describe('send message to group api/v1/groups/:id/messages', () => {
    it('should not send messsage to group if user has no token', async () => {
      await noToken('/api/v1/groups/1/messages', 'post');
    });
    it('should not send message to group if id param is NaN', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).post('/api/v1/groups/d/messages').send(sentMsg).set('Cookie', [`token=${token}`]);
      error(resp, 400, 'param IDs must be numbers');
    });
    it('should not send message to group if group ID is non existent', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).post('/api/v1/groups/1/messages').send(sentMsg).set('Cookie', [`token=${token}`]);
      error(resp, 404, 'Group ID does not exist');
    });
    it('should send message to a group if user and group ID is valid', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      await request(server).post('/api/v1/groups/1/users').send({ email: 'sam@epicmail.com' }).set('Cookie', [`token=${token}`]);
      const resp = await request(server).post('/api/v1/groups/1/messages').send(sentMsg).set('Cookie', [`token=${token}`]);
      success(resp, 201);
    });
  });
  describe('get all groups api/v1/groups/', () => {
    it('should not realease groups to user with no token', async () => {
      await noToken('/api/v1/groups');
    });
    it('should not realease groups to valid user', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const messages = await request(server).get('/api/v1/groups').set('Cookie', [`token=${token}`]);
      expect(messages.body).to.have.property('status');
      expect(messages.body.status).to.be.equal(200);
      expect(messages.body).to.have.property('data');
      expect(messages.body).to.not.have.property('error');
      expect(messages.body.data).to.be.an('array');
    });
  });
  describe('patch group api/v1/groups/:id/name', () => {
    it('should not patch group if user has no token', async () => {
      await noToken('/api/v1/groups/1/name', 'update');
    });
    it('should not patch group if id param is NaN', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).patch('/api/v1/groups/d/name').set('Cookie', [`token=${token}`]);
      error(resp, 400, 'param IDs must be numbers');
    });
    it('should not patch group if group ID is non existent', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).patch('/api/v1/groups/1/name').send({ name: 'sam' }).set('Cookie', [`token=${token}`]);
      error(resp, 404, 'Group ID does not exist');
    });
    it('should patch a group if user and group ID is valid', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      const resp = await request(server).patch('/api/v1/groups/1/name').send({ name: 'sam' }).set('Cookie', [`token=${token}`]);
      success(resp, 200);
    });
  });
  describe('Delete group api/v1/groups/:id/name', () => {
    it('should not delete group if user has no token', async () => {
      await noToken('/api/v1/groups/1', 'delete');
    });
    it('should not delete group if id param is NaN', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      const resp = await request(server).delete('/api/v1/groups/d').set('Cookie', [`token=${token}`]);
      error(resp, 400, 'param IDs must be numbers');
    });
    it('should not delete group if user is not admin', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const unauth = await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      const unauthtoken = unauth.body.data[0].token;
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      const resp = await request(server).delete('/api/v1/groups/1').set('Cookie', [`token=${unauthtoken}`]);
      error(resp, 401, 'You are not authorized to delete this group');
    });
    it('should delete a group if user is admin', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('Cookie', [`token=${token}`]);
      const resp = await request(server).delete('/api/v1/groups/1').set('Cookie', [`token=${token}`]);
      success(resp, 200);
    });
  });
});
