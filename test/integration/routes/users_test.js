import { expect } from 'chai';
import request from 'supertest';
import dbHandler from '../../../src/database/dbHandler';

let server;
let user1;
let user2;
let sentMsg;

describe('USER API ENDPOINTS', () => {
  beforeEach(() => {
    server = require('../../../src/index');
    user1 = {
      email: 'ewere@epicmail.com',
      recoveryEmail: 'ewere@gmail.com',
      firstName: 'admin',
      lastName: 'user',
      confirmPassword: 'admin123',
      password: 'admin123',
      phoneNumber: '2348130439102',
    };
    user2 = {
      email: 'sam@epicmail.com',
      recoveryEmail: 'sam@gmail.com',
      firstName: 'sam',
      lastName: 'user',
      confirmPassword: 'user123',
      password: 'user123',
      phoneNumber: '2348130439102',
    };
    sentMsg = {
      subject: 'i just registered',
      email: 'sam@epicmail.com',
      message: 'its so wonderful to be part of this app',
    };
  });
  after(async () => {
    await dbHandler.resetDb();
    server.close();
  });
  describe('Get Contacts', () => {
    it('should not get contacts if user has no token', async () => {
      const res = await request(server).get('/api/v1/users/contacts').set('Cookie', ['token=""']);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(401);
      expect(res.body).to.have.property('error');
      expect(res.body).to.not.have.property('data');
      expect(res.body.error).to.be.a('string');
      expect(res.body.error).to.include('Access denied, no token provided');
    });

    it('should get contacts if user has valid token', async () => {
      let res = await request(server).post('/api/v1/auth/signup').send(user1);
      await request(server).post('/api/v1/auth/signup').send(user2);
      const { token } = res.body.data[0];
      await request(server).post('/api/v1/messages/').send(sentMsg).set('Cookie', [`token=${token}`]);
      res = await request(server).get('/api/v1/users/contacts').set('Cookie', [`token=${token}`]);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(200);
      expect(res.body).to.have.property('data');
      expect(res.body).to.not.have.property('error');
      expect(res.body.data).to.be.a('array');
      expect(res.body.data).to.have.lengthOf(1);
    });
  });
  describe('Update User Info', () => {
    it('should update user with valid token', async () => {
      const signin = await request(server).post('/api/v1/auth/login').send({ email: 'ewere@epicmail.com', password: 'admin123' });
      const { token } = signin.body.data[0];
      const res = await request(server).patch('/api/v1/users/save').set('Cookie', [`token=${token}`]).send({ password: '12345', confirmPassword: '12345' });
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.equal(200);
      expect(res.body).to.have.property('data');
      expect(res.body).to.not.have.property('error');
      expect(res.body.data).to.be.a('array');
    });
  });
});
