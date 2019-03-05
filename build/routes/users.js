"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = require('lodash');

var joi = require('joi');

var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var config = require('config');

var router = require('express').Router();

var _require = require('../db'),
    db = _require.db;

var validate = function validate(user) {
  var schema = {
    /* id: joi.number().equal(0), */
    firstName: joi.string().min(3).max(15).required(),
    lastName: joi.string().min(3).max(15).required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string().max(13).min(13).required(),
    password: joi.string().min(5).max(255).required()
  };
  return joi.validate(user, schema);
};

router.post('/',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _validate, error, user, id, salt, token, resp;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            /* console.log(req.body); */
            _validate = validate(req.body), error = _validate.error;

            if (!error) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.send({
              status: 400,
              error: error.details[0].message
            }));

          case 3:
            user = db.users.find(function (usr) {
              return usr.email === req.body.email;
            });

            if (!user) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", res.send({
              status: 400,
              error: 'User already registered'
            }));

          case 6:
            id = db.users.length + 1;
            user = _.pick(req.body, ['firstName', 'lastName', 'email', 'phoneNumber', 'isAdmin', 'password']);
            user.id = id;
            user.isAdmin = id === 1;
            _context.next = 12;
            return bcrypt.genSalt(10);

          case 12:
            salt = _context.sent;
            _context.next = 15;
            return bcrypt.hash(user.password, salt);

          case 15:
            user.password = _context.sent;
            db.users.push(user);
            token = jwt.sign({
              id: user.id
            }, config.get('jwtPrivateKey'));
            /* const resp = _.pick(user, ['id', 'firstName', 'lastName', 'email', 'isAdmin']); */

            resp = [{
              token: token
            }];
            return _context.abrupt("return", res.send({
              status: 201,
              data: resp
            }));

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;