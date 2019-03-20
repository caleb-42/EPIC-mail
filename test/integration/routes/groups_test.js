import { expect } from 'chai';
import request from 'supertest';
import dbHandler from '../../../src/database/dbHandler';

let server;
let user;

const user1 = {
  email: 'ewere@gmail.com',
  firstName: 'admin',
  lastName: 'user',
  confirmPassword: 'admin123',
  password: 'admin123',
  phoneNumber: '2348130439102',
};

describe('MAILS API ENDPOINTS', () => {
  const noToken = async (endpoint, method = 'get') => {
    const token = '';
    let res;
    if (method === 'get') res = await request(server).get(endpoint).set('x-auth-token', token);
    if (method === 'post') res = await request(server).post(endpoint).send({ name: 'caleb' }).set('x-auth-token', token);
    if (method === 'delete') res = await request(server).delete(endpoint).set('x-auth-token', token);
    if (method === 'update') res = await request(server).patch(endpoint).send({ name: 'caleb' }).set('x-auth-token', token);
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.be.equal(401);
    expect(res.body).to.have.property('error');
    expect(res.body).to.not.have.property('data');
    expect(res.body.error).to.be.a('string');
    expect(res.body.error).to.include('Access denied, no token provided');
  };
  beforeEach(() => {
    server = require('../../../src/index');
    user = {
      email: 'ewere@gmail.com',
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
      let res = await request(server).post('/api/v1/users').send(user1);
      res = await request(server).post('/api/v1/auth').send(user);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('x-auth-token', token);
      const resp = await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('x-auth-token', token);
      expect(resp.status).to.be.equal(400);
      expect(resp.body).to.have.property('status');
      expect(resp.body.status).to.be.equal(400);
      expect(resp.body).to.have.property('error');
      expect(resp.body).to.not.have.property('data');
      expect(resp.body.error).to.be.a('string');
      expect(resp.body.error).to.include('Group already registered');
    });
    it('should create group if user has valid token and group exist', async () => {
      let res = await request(server).post('/api/v1/users').send(user1);
      res = await request(server).post('/api/v1/auth').send(user);
      const { token } = res.body.data[0];
      const resp = await request(server).post('/api/v1/groups/').send({ name: 'caleb' }).set('x-auth-token', token);
      expect(resp.status).to.be.equal(201);
      expect(resp.body).to.have.property('status');
      expect(resp.body.status).to.be.equal(201);
      expect(resp.body).to.have.property('data');
      expect(resp.body).to.not.have.property('error');
      expect(resp.body.data).to.be.an('array');
    });
  });
});
