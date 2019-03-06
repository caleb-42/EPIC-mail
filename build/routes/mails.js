"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _winston = _interopRequireDefault(require("winston"));

var _middleware = _interopRequireDefault(require("../middleware"));

var _dbHandler = _interopRequireDefault(require("../dbHandler"));

var router = _express.default.Router();

router.get('/', _middleware.default,
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(req, res) {
    var id;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.user.id.id;

            _winston.default.info(id);

            return _context.abrupt("return", res.send({
              status: 200,
              data: _dbHandler.default.getMessages(id)
            }));

          case 3:
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