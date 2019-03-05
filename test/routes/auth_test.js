import { expect } from 'chai';
import request from 'supertest';
import {
  describe, it, beforeEach, afterEach, after,
} from 'mocha';
import { reset } from '../../src/db';

let server;
let user;
const register = {
  email: 'ewere@gmail.com',
  firstName: 'admin',
  lastName: 'user',
  password: 'admin123',
  phoneNumber: '2348130439102',
};

describe('AUTH API ENDPOINTS', () => {
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
    reset();
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
      let res = await request(server).post('/api/v1/users').send(register);
      res = await request(server).post('/api/v1/auth').send(user);
      /* console.log(res); */
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(200);
      expect(res.body).to.have.property('data');
      expect(res.body).to.not.have.property('error');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data[0]).to.have.property('token');
    });
    it('should not sign in user with wrong email and right password', async () => {
      let res = await request(server).post('/api/v1/auth').send(user);
      user.email = 'paul@gmail.com';
      res = await request(server).post('/api/v1/auth').send(user);
      invalidSignIn(res);
    });
    it('should not sign in user with right email and wrong password', async () => {
      let res = await request(server).post('/api/v1/auth').send(user);
      user.password = 'naruto';
      res = await request(server).post('/api/v1/auth').send(user);
      invalidSignIn(res);
    });
  });
});
