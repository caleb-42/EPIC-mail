import express from 'express';
import config from 'config';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import users from './routes/users';
import mails from './routes/mails';
import auth from './routes/auth';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
/* app.use(express.static('UI')); */ /* testing locally */
app.use('/api/v1/users', users);
app.use('/api/v1/messages', mails);
app.use('/api/v1/auth', auth);

if (!config.get('jwtPrivateKey')) {
  winston.error('Fatal ERROR : jwtPrivateKey is not defined');
  process.exit(1);
}

app.get('/', (req, res) => res.status(200).send('Welcome to EPIC-mail'));

const port = process.env.PORT || 3000;
const server = app.listen(port);

module.exports = server;
