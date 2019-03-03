const express = require('express');
const config = require('config');
const winston = require('winston');
const users = require('./routes/users');

const app = express();

app.use(express.json());
app.use('/api/v1/users', users);

app.get('/', (req, res) => {
  res.status(200).send('Welcome to EPIC-mail');
});

if (!config.get('jwtPrivateKey')) {
  winston.error('Fatal ERROR : jwtPrivateKey is not defined');
  process.exit(1);
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
