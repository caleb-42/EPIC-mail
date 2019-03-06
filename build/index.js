"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _config = _interopRequireDefault(require("config"));

var _winston = _interopRequireDefault(require("winston"));

var _users = _interopRequireDefault(require("./routes/users"));

var _mails = _interopRequireDefault(require("./routes/mails"));

var _auth = _interopRequireDefault(require("./routes/auth"));

var app = (0, _express.default)();
app.use(_express.default.json());
app.use(_express.default.static('UI'));
/* testing locally */

app.use('/api/v1/users', _users.default);
app.use('/api/v1/mails', _mails.default);
app.use('/api/v1/auth', _auth.default);

if (!_config.default.get('jwtPrivateKey')) {
  _winston.default.error('Fatal ERROR : jwtPrivateKey is not defined');

  process.exit(1);
}

app.get('/', function (req, res) {
  return res.status(200).send('Welcome to EPIC-mail');
});
var port = process.env.PORT || 3000;
var server = app.listen(port);
module.exports = server;