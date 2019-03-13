import { expect } from 'chai';
import request from 'supertest';
import dbHandler from '../../../src/v1/database/dbHandler';

let server;
let user1;
let user2;

describe('USER API ENDPOINTS', () => {
  beforeEach(() => {
    server = require('../../../src/index');
    user1 = {
      email: 'ewere@gmail.com',
      firstName: 'admin',
      lastName: 'user',
      confirmPassword: 'admin123',
      password: 'admin123',
      confirmPassword: 'admin123',
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
  });
  afterEach(() => {
    dbHandler.resetDb();
    server.close();
  });
  describe('Sign Up', () => {
    it('should create user with valid request', async () => {
      const res = await request(server).post('/api/v1/users').send(user1);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(201);
      expect(res.body).to.have.property('data');
      expect(res.body).to.not.have.property('error');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data[0]).to.have.property('token');
    });
    it('should not create user that already exist', async () => {
      let res = await request(server).post('/api/v1/users').send(user1);
      res = await request(server).post('/api/v1/users').send(user1);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.not.have.property('data');
      expect(res.body.error).to.be.a('string');
      expect(res.body.error).to.include('User already registered');
    });
  });
  describe('Get Contacts', () => {
    it('should not get contacts if user has no token', async () => {
      const res = await request(server).get('/api/v1/messages/1').set('x-auth-token', '');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(401);
      expect(res.body).to.have.property('error');
      expect(res.body).to.not.have.property('data');
      expect(res.body.error).to.be.a('string');
      expect(res.body.error).to.include('Access denied, no token provided');
    });

    it('should get contacts if user has valid token', async () => {
      let res = await request(server).post('/api/v1/users').send(user1);
      const token = await request(server).post('/api/v1/users').send(user2);
      res = await request(server).get('/api/v1/users/contacts').set('x-auth-token', token.body.data[0].token);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(200);
      expect(res.body).to.have.property('data');
      expect(res.body).to.not.have.property('error');
      expect(res.body.data).to.be.a('array');
      expect(res.body.data).to.have.lengthOf(1);
    });
  });
});
