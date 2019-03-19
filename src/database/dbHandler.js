import _ from 'lodash';
import config from 'config';
import { Pool } from 'pg';
import date from 'date-and-time';
import helper from '../utilities';
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
  
  async createUser(newUser) {
    /* create user using in user table */
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
export default dbHandler;
