import { expect } from 'chai';
import request from 'supertest';
import dbHandler from '../../../src/database/dbHandler';

let server;
let user;
const register = {
  email: 'ewere@epicmail.com',
  firstName: 'admin',
  lastName: 'user',
  confirmPassword: 'admin123',
  password: 'admin123',
  phoneNumber: '2348130439102',
};
const user1 = {
  email: 'ewere@epicmail.com',
  firstName: 'admin',
  lastName: 'user',
  confirmPassword: 'admin123',
  password: 'admin123',
  phoneNumber: '2348130439102',
};

describe('AUTH API ENDPOINTS', () => {
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
  describe('Sign In', () => {
    const invalidSignIn = (res) => {
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.not.have.property('data');
      expect(res.body.error).to.be.a('string');
      expect(res.body.error).to.include('Invalid email or password');
    };
    it('should sign in user with valid email and password', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(register);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(201);
      expect(res.body).to.have.property('data');
      expect(res.body).to.not.have.property('error');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data[0]).to.have.property('token');
    });
    it('should not sign in user with wrong email and right password', async () => {
      user.email = 'paul@epicmail.com';
      const res = await request(server).post('/api/v1/auth/login').send(user);
      invalidSignIn(res);
    });
    it('should not sign in user with right email and wrong password', async () => {
      user.password = 'naruto';
      const res = await request(server).post('/api/v1/auth/login').send(user);
      invalidSignIn(res);
    });
  });
  describe('Sign Up', () => {
    it('should create user with valid request', async () => {
      const res = await request(server).post('/api/v1/auth/signup').send(user1);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(201);
      expect(res.body).to.have.property('data');
      expect(res.body).to.not.have.property('error');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data[0]).to.have.property('token');
    });
    it('should not create user that already exist', async () => {
      let res = await request(server).post('/api/v1/auth/signup').send(user1);
      res = await request(server).post('/api/v1/auth/signup').send(user1);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.not.have.property('data');
      expect(res.body.error).to.be.a('string');
      expect(res.body.error).to.include('User already registered');
    });
  });
});
