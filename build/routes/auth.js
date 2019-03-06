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
    email: _joi.default.string().email().required(),
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
    var _validate, error, user, token;

    return _regenerator.default.wrap(function _callee$(_context) {
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
            user = _dbHandler.default.find('users', req.body, 'email');

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
            return _dbHandler.default.validateUser(req.body, user);

          case 8:
            token = _context.sent;

            if (token) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", res.send({
              status: 400,
              error: 'Invalid email or password'
            }));

          case 11:
            return _context.abrupt("return", res.send({
              status: 200,
              data: {
                token: token,
                firstName: user.firstName
              }
            }));

          case 12:
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