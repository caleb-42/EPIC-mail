import express from 'express';
import cors from 'cors';
import winston from 'winston';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { auth, host, client } from './vars';
import users from './routes/users';
import mails from './routes/mails';
import Auth from './routes/auth';
import groups from './routes/groups';

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const allowedOrigins = [client.uri, 'https://caleb-42.github.io'];
app.use(cors({
  origin(origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not '
        + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true,
}));
app.use(cookieParser());
app.use((req, res, next) => {
  setTimeout(next, 3000);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/* app.use(express.static('UI')); */ /* testing locally */
app.use('/uploads', express.static('uploads'));
app.use('/api/v1/auth', Auth);
app.use('/api/v1/users', users);
app.use('/api/v1/messages', mails);
app.use('/api/v1/groups', groups);

if (!auth.jwtKey) {
  winston.error('Fatal ERROR : jwtPrivateKey is not defined');
  process.exit(1);
}

app.get('/', (req, res) => res.status(200).send('Welcome to EPIC-mail'));

const port = host.port || 3000;
const server = app.listen(port);

app.use((req, res) => res.status(404).send({
  status: 404,
  error: `Route ${req.url} Not found`,
}));

app.use((error, req, res) => res.status(500).send({
  status: 500,
  error,
}));

module.exports = server;
