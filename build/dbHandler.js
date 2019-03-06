"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = _interopRequireDefault(require("lodash"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

var _db = require("./db");

var DbHandler =
/*#__PURE__*/
function () {
  function DbHandler() {
    (0, _classCallCheck2.default)(this, DbHandler);
    this.db = _db.db;
  }

  (0, _createClass2.default)(DbHandler, [{
    key: "find",
    value: function find(table, body, query) {
      return this.db[table].find(function (tab) {
        return tab[query] === body[query];
      });
    }
  }, {
    key: "createUser",
    value: function () {
      var _createUser = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(newUser) {
        var id, user, salt, token;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = this.db.users.length + 1;
                user = _lodash.default.pick(newUser, ['firstName', 'lastName', 'email', 'phoneNumber', 'isAdmin', 'password']);
                user.id = id;
                user.isAdmin = id === 1;
                _context.next = 6;
                return _bcrypt.default.genSalt(10);

              case 6:
                salt = _context.sent;
                _context.next = 9;
                return _bcrypt.default.hash(user.password, salt);

              case 9:
                user.password = _context.sent;
                this.db.users.push(user);
                token = _jsonwebtoken.default.sign({
                  id: user.id
                }, _config.default.get('jwtPrivateKey'));
                return _context.abrupt("return", token);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createUser(_x) {
        return _createUser.apply(this, arguments);
      }

      return createUser;
    }()
  }, {
    key: "validateUser",
    value: function () {
      var _validateUser = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(guest, user) {
        var validPassword;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _bcrypt.default.compare(guest.password, user.password);

              case 2:
                validPassword = _context2.sent;

                if (validPassword) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", false);

              case 5:
                return _context2.abrupt("return", _jsonwebtoken.default.sign({
                  id: user.id
                }, _config.default.get('jwtPrivateKey')));

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function validateUser(_x2, _x3) {
        return _validateUser.apply(this, arguments);
      }

      return validateUser;
    }()
  }, {
    key: "getMessages",
    value: function getMessages(id) {
      var messages = this.db.messages.filter(function (message) {
        return message.senderId === id || message.receiverId === id;
      });
      return messages;
    }
  }]);
  return DbHandler;
}();

var dbHandler = new DbHandler();
module.exports = dbHandler;