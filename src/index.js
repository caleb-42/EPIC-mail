import express from 'express';
import config from 'config';
import winston from 'winston';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import users1 from './v1/routes/users';
import mails1 from './v1/routes/mails';
import auth1 from './v1/routes/auth';
import users2 from './v2/routes/users';
import mails2 from './v2/routes/mails';
import auth2 from './v2/routes/auth';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/* app.use(express.static('UI')); */ /* testing locally */
app.use('/api/v1/users', users1);
app.use('/api/v1/messages', mails1);
app.use('/api/v1/auth', auth1);
app.use('/api/v2/users', users2);
app.use('/api/v2/messages', mails2);
app.use('/api/v2/auth', auth2);

if (!config.get('jwtPrivateKey')) {
  winston.error('Fatal ERROR : jwtPrivateKey is not defined');
  process.exit(1);
}

app.get('/', (req, res) => res.status(200).send('Welcome to EPIC-mail'));

const port = process.env.PORT || 3000;
const server = app.listen(port);

module.exports = server;
