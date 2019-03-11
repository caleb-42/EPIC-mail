import { expect } from 'chai';
import request from 'supertest';
import dbHandler from '../../../src/database/dbHandler';

let server;
let user;

describe('USER API ENDPOINTS', () => {
  beforeEach(() => {
    server = require('../../../src/index');
    user = {
      email: 'ewere@gmail.com',
      firstName: 'admin',
      lastName: 'user',
      password: 'admin123',
      phoneNumber: '2348130439102',
    };
  });
  afterEach(() => {
    dbHandler.resetDb();
    server.close();
  });
  describe('Sign Up', () => {
    it('should create user with valid request', async () => {
      const res = await request(server).post('/api/v1/users').send(user);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(201);
      expect(res.body).to.have.property('data');
      expect(res.body).to.not.have.property('error');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data[0]).to.have.property('token');
    });
    it('should not create user that already exist', async () => {
      let res = await request(server).post('/api/v1/users').send(user);
      res = await request(server).post('/api/v1/users').send(user);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.not.have.property('data');
      expect(res.body.error).to.be.a('string');
      expect(res.body.error).to.include('User already registered');
    });
  });
});
