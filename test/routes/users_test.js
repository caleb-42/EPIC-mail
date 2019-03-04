const {
  describe, it, beforeEach, afterEach,
} = require('mocha');
const { expect } = require('chai');
const request = require('supertest');

let server;
let user;

describe('USER API ENDPOINTS', () => {
  beforeEach(() => {
    server = require('../../index');
    user = {
      email: 'ewere@gmail.com',
      firstName: 'admin',
      lastName: 'user',
      password: 'admin123',
      phoneNumber: '2348130439102',
    };
  });
  afterEach(() => {
    server.close();
  });
  describe('Sign Up', () => {
    it('should create user with valid request', async () => {
      const res = await request(server).post('/api/v1/users').send(user);
      /* console.log(res); */
      expect(res.status).to.be.equal(201);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('token');
    });
    it('should not create user that already exist', async () => {
      let res = await request(server).post('/api/v1/users').send(user);
      res = await request(server).post('/api/v1/users').send(user);
      expect(res.status).to.be.equal(400);
      expect(res.text).to.be.a('string');
      expect(res.text).to.include('User already registered');
    });
  });
});
