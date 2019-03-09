import request from 'supertest';
import { expect } from 'chai';
import {
  describe, it, beforeEach, afterEach,
} from 'mocha';
import dbHandler from '../../src/dbHandler';

let server;
let user;

describe('AUTH MIDDLEWARE', () => {
  beforeEach(() => {
    server = require('../../src/index');
    user = {
      email: 'ewere@gmail.com',
      firstName: 'admin',
      lastName: 'user',
      password: 'admin123',
      phoneNumber: '2348130439102',
    };
  });
  afterEach(async () => {
    server.close();
    dbHandler.resetDb();
  });

  const exec = token => request(server)
    .get('/api/v1/messages')
    .set('x-auth-token', token);

  it('should return 401 code if token is not provided', async () => {
    const token = '';
    const res = await exec(token);
    expect(res.status).to.be.equal(401);
  });

  it('should return 200 code if token is valid', async () => {
    const tokenResp = await request(server).post('/api/v1/users').send(user);
    const { token } = tokenResp.body.data[0];
    const res = await exec(token);
    expect(res.status).to.be.equal(200);
  });
});
