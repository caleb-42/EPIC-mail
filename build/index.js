"use strict";

var express = require('express');

var config = require('config');

var winston = require('winston');

var users = require('./routes/users');

var auth = require('./routes/auth');

var app = express();
app.use(express.json());
/* app.use(express.static('UI')); */

/* testing locally */

app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

if (!config.get('jwtPrivateKey')) {
  winston.error('Fatal ERROR : jwtPrivateKey is not defined');
  process.exit(1);
}

app.get('/', function (req, res) {
  return res.status(200).send('Welcome to EPIC-mail');
});
var port = process.env.PORT || 3000;
var server = app.listen(port);
module.exports = server;