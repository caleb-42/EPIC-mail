"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
    email: joi.string().email().required(),
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
    var _validate, error, user, validPassword, token, resp;

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

            if (user) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", res.send({
              status: 400,
              error: 'Invalid email or password'
            }));

          case 6:
            _context.next = 8;
            return bcrypt.compare(req.body.password, user.password);

          case 8:
            validPassword = _context.sent;

            if (validPassword) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", res.send({
              status: 400,
              error: 'Invalid email or password'
            }));

          case 11:
            token = jwt.sign({
              id: user.id
            }, config.get('jwtPrivateKey'));
            resp = [{
              token: token,
              firstName: user.firstName
            }];
            return _context.abrupt("return", res.send({
              status: 200,
              data: resp
            }));

          case 14:
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