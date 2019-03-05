import { expect } from 'chai';
import request from 'supertest';
import {
  describe, it, beforeEach, afterEach,
} from 'mocha';

let server;

describe('APP START', () => {
  beforeEach(() => {
    server = require('../src/index'); // eslint-disable-line global-require
  });
  afterEach(() => {
    server.close();
  });
  describe('app localhost', () => {
    it('should return status code of 200', async () => {
      const res = await request(server).get('/');
      expect(res.status).to.be.equal(200);
    });
    it('should return a string', async () => {
      const res = await request(server).get('/');
      expect(res.text).to.be.a('string');
    });
    it('should return Welcome to EPIC-mail', async () => {
      const res = await request(server).get('/');
      expect(res.text).to.include('Welcome to EPIC-mail');
    });
  });
});
