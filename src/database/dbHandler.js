import _ from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { Pool } from 'pg';
import date from 'date-and-time';
import db from './db';


class DbHandler {
  constructor() {
    this.db = _.cloneDeep(db);
    this.pool = new Pool({
      user: 'root',
      host: 'localhost',
      database: 'epicmaildev',
      password: 'ewere',
      port: 5432,
    });
  }

  find(table, body, query, key = null) {
    /* find any record in database */
  }

  generateJWT(user) {
    /* generate jwt token */
    return jwt.sign({ id: user.id }, config.get('jwtPrivateKey'));
  }

  async createUser(newUser) {
    /* create user using in user table */
  }

  async validateUser(guest, user) {
    /* validate user password using bcrypt */
    const validPassword = await bcrypt.compare(guest.password, user.password);
    if (!validPassword) return false;
    return this.generateJWT(user);
  }

  getUsers(id) {
    /* get all contacts */
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

  resetDb() {
    /* reset db */
  }
}
const dbHandler = new DbHandler();
module.exports = dbHandler;
