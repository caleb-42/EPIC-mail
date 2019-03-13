/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import dbHandler from '../../../src/v1/database/dbHandler';
import auth from '../../../src/middleware/auth';

describe('AUTH MIDDLEWARE UNIT TEST', () => {
  it('should populate req.user with the payload of a valid json web token', async () => {
    const token = dbHandler.generateJWT({ id: 1 });
    const mockReq = {
      header() {},
    };
    const headerstub = sinon.stub(mockReq, 'header').returns(token);
    const req = mockReq;
    const res = {};
    const next = () => {};

    auth(req, res, next);
    expect(req.user).to.be.an('object');
    expect(req.user).to.have.property('id');
    expect(req.user.id).to.be.equal(1);
    expect(headerstub.calledOnce).to.be.true;
  });

  it('should call the next function if user is valid', async () => {
    const token = dbHandler.generateJWT({ id: 1 });
    const mockReq = {
      header() {},
    };
    sinon.stub(mockReq, 'header').returns(token);
    const req = mockReq;
    const res = {};
    const next = sinon.spy();

    auth(req, res, next);
    expect(next.calledOnce).to.be.true;
  });
});
