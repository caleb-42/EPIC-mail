"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _joi = _interopRequireDefault(require("joi"));

var _express = _interopRequireDefault(require("express"));

var _dbHandler = _interopRequireDefault(require("../dbHandler"));

var router = _express.default.Router();

var validate = function validate(user) {
  var schema = {
    /* id: joi.number().equal(0), */
    firstName: _joi.default.string().min(3).max(15).required(),
    lastName: _joi.default.string().min(3).max(15).required(),
    email: _joi.default.string().email().required(),
    phoneNumber: _joi.default.string().max(13).min(13).required(),
    password: _joi.default.string().min(5).max(255).required()
  };
  return _joi.default.validate(user, schema);
};

router.post('/',
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(req, res) {
    var _validate, error, userPresent, token;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
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
            userPresent = _dbHandler.default.find('users', req.body, 'email');

            if (!userPresent) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", res.send({
              status: 400,
              error: 'User already registered'
            }));

          case 6:
            _context.next = 8;
            return _dbHandler.default.createUser(req.body);

          case 8:
            token = _context.sent;
            return _context.abrupt("return", res.send({
              status: 201,
              data: [{
                token: token
              }]
            }));

          case 10:
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