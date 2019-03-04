const express = require('express');
const config = require('config');
const winston = require('winston');
const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();

app.use(express.json());
/* app.use(express.static('UI')); */ /* testing locally */
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

if (!config.get('jwtPrivateKey')) {
  winston.error('Fatal ERROR : jwtPrivateKey is not defined');
  process.exit(1);
}

app.get('/', (req, res) => res.status(200).send('Welcome to EPIC-mail'));

const port = process.env.PORT || 3000;
const server = app.listen(port);

module.exports = server;
