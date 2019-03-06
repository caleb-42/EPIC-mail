"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

var auth = function auth(req, res, next) {
  var token = req.header('x-auth-token');

  if (!token) {
    return res.send({
      status: 401,
      error: 'Access denied, no token provided'
    });
  }

  try {
    var decoded = _jsonwebtoken.default.verify(token, _config.default.get('jwtPrivateKey'));

    req.user = decoded;
    next();
  } catch (e) {
    return res.send({
      status: 400,
      error: 'Invalid token'
    });
  }
};

module.exports = auth;