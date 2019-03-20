/* eslint-disable no-unused-expressions */
/* import request from 'supertest';
import { expect } from 'chai';
import dbHandler from '../../../src/database/dbHandler';

let server;
let user;

describe('AUTH MIDDLEWARE INTEGRATION TEST', () => {
  beforeEach(() => {
    server = require('../../../src/index');
    user = {
      email: 'ewere@gmail.com',
      firstName: 'admin',
      lastName: 'user',
      confirmPassword: 'admin123',
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
}); */
