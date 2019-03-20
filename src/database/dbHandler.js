import _ from 'lodash';
import config from 'config';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import date from 'date-and-time';
import helper from '../utilities';
import db from './db';

class DbHandler {
  constructor() {
    this.db = _.cloneDeep(db);
    this.pool = new Pool(config.get('database'));
  }

  async find(table, body, query, key = null) {
    /* find any record in database */
    try {
      if (!key) key = query;
      const { rows } = await this.pool.query(`SELECT * FROM ${table} WHERE ${query} = $1`, [body[key]]);
      return rows[0];
    } catch (e) {
      return false;
    }
  }

  async createUser(newUser) {
    /* create user using in user table */
    const user = _.pick(newUser, ['firstName', 'lastName', 'email', 'phoneNumber', 'password']);
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      const { rows } = await this.pool.query(`INSERT INTO users (
        firstName, lastName, email, phoneNumber, password) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`, Object.values(user));
      const createdUser = rows[0];
      const token = helper.generateJWT(createdUser);
      return token;
    } catch (err) {
      return '';
    }
  }

  async getUsers(id) {
    /* get all contacts */
    try {
      const { rows } = await this.pool.query('SELECT * FROM users WHERE id != $1', [id]);
      return rows;
    } catch (err) {
      winston.error(err);
    }
  }

  getMessages(id) {
    /* get all received messages for a particular user */
  }

  getInboxMessages(id, type = 'all') {
    /* get all messages for a particular user */
  }

  getOutboxMessages(id, type) {
    /* get either draft or sent messages */
  }

  getMessageById(id) {
    /* get a particular message */
  }

  updateMessageById(id, body) {
    /* update a particular message */
  }

  sendMessage(msg) {
    /* send message from a particular user to another */
  }

  sendDraftMessage(msg) {
    /* send draft message */
  }

  saveMessage(msg) {
    /* creat a draft message */
  }

  deleteMessage(id, userId) {
    /* delete a draft message......... or convert unread message to draft */
  }

  async resetDb() {
    /* reset db */
    await this.pool.query(`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS messages CASCADE; 
    DROP TYPE IF EXISTS _status;
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(30),
      lastname VARCHAR(30),
      email VARCHAR(30),
      phonenumber VARCHAR(30),
      password TEXT
    );
    CREATE TYPE _status as enum('read', 'unread', 'draft');
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      createdon VARCHAR(30),
      message VARCHAR(500),
      parentmessageid VARCHAR(30),
      receiverid INTEGER,
      subject VARCHAR(30),
      senderid INTEGER,
      status _status,
      constraint fk_user
      foreign key (receiverid) 
      REFERENCES users (id)
    );`);
  }
}
const dbHandler = new DbHandler();
export default dbHandler;
