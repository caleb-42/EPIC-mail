import dotenv from 'dotenv';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import winston from 'winston';
import { Pool } from 'pg';
import date from 'date-and-time';
import helper from '../utilities';

dotenv.config();

class DbHandler {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
    } else {
      this.pool = new Pool({
        user: process.env.DBUSERNAME,
        host: 'localhost',
        database: process.env.DBNAME,
        password: process.env.DBPASS,
        port: 5432,
      });
    }
  }

  async find(table, body, query, key = null) {
    /* find any record in database */
    try {
      if (!key) key = query;
      const { rows } = await this.pool.query(`SELECT * FROM ${table} WHERE ${query} = $1`, [body[key]]);
      return rows[0];
    } catch (e) {
      winston.error(e);
      return 500;
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
      winston.error(err);
      return 500;
    }
  }

  async getUsers(id) {
    /* get all contacts */
    try {
      const { rows } = await this.pool.query('SELECT * FROM users WHERE id != $1', [id]);
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async getGroups(id) {
    /* get all contacts */
    try {
      const { rows } = await this.pool.query('SELECT * FROM groups WHERE userid = $1', [id]);
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async getMessages(id) {
    /* get all received messages for a particular user */
    try {
      const { rows } = await this.pool.query('SELECT messages.*, users.firstname, users.lastname FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE (messages.receiverid = $1);', [id]);
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async getInboxMessages(id, type = 'all') {
    /* get all messages for a particular user */
    try {
      if (type === 'all') {
        const { rows } = await this.pool.query('SELECT messages.*, users.firstname, users.lastname FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE receiverid = $1', [id]);
        return rows;
      }
      const { rows } = await this.pool.query('SELECT messages.*, users.firstname, users.lastname FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE receiverid = $1 AND status = $2', [id, type]);
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async getOutboxMessages(id, type) {
    /* get either draft or sent messages */
    try {
      if (type === 'draft') {
        const { rows } = await this.pool.query('SELECT messages.*, users.firstname, users.lastname FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.senderId = $1 AND messages.status = $2', [id, 'draft']);
        return rows;
      }
      const { rows } = await this.pool.query('SELECT messages.*, users.firstname, users.lastname FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.senderId = $1 AND (messages.status = $2 OR messages.status = $3)', [id, 'unread', 'read']);
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async getMessageById(id, userId) {
    /* get a particular message */
    try {
      const { rows } = await this.pool.query('SELECT messages.*, users.firstname, users.lastname FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.id = $1', [id]);
      if (rows.length === 0) return rows;
      if (rows[0].receiverid === userId) {
        await this.pool.query(`UPDATE messages SET status = $1
        WHERE (id = $2) RETURNING *`, ['read', id]);
        rows[0].status = 'read';
      }
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async updateMessageById(req, msg) {
    /* update a particular message */
    try {
      const message = req.message || msg.message;
      const receiverId = req.receiverId || msg.receiverid;
      const subject = req.subject || msg.subject;

      const { rows } = await this.pool.query(`UPDATE messages SET message = $1, receiverId = $2, subject = $3
      WHERE (id = $4) RETURNING *`,
      [message, receiverId, subject, msg.id]);
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async sendMessage(msg) {
    /* send message from a particular user to another */
    try {
      const now = new Date();
      const createdOn = date.format(now, 'ddd MMM DD YYYY');
      msg.createdOn = createdOn;
      msg.status = 'unread';
      msg.parentMessageId = msg.parentMessageId || null;

      const message = _.pick(msg, ['createdOn', 'message', 'parentMessageId', 'receiverId', 'subject', 'senderId', 'status']);
      const { rows } = await this.pool.query(`INSERT INTO messages (
        createdOn, message, parentMessageId,
        receiverid, subject, senderid, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      Object.values(message));
      const sentMsg = rows[0];
      return [sentMsg];
    } catch (err) {
      winston.error(err.stack);
      return 500;
    }
  }

  async sendDraftMessage(msg) {
    try {
      const { rows } = await this.pool.query('UPDATE messages SET status = $1 WHERE (id = $2) RETURNING *',
        ['unread', msg.id]);
      const sentMsg = rows[0];
      return [sentMsg];
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async saveMessage(msg) {
    /* creat a draft message */
    try {
      const now = new Date();
      const createdOn = date.format(now, 'ddd MMM DD YYYY');
      msg.createdOn = createdOn;
      msg.status = 'draft';
      msg.parentMessageId = msg.parentMessageId || null;
      msg.receiverId = msg.receiverId || null;

      const message = _.pick(msg, ['createdOn', 'message', 'parentMessageId', 'receiverId', 'subject', 'senderId', 'status']);
      const { rows } = await this.pool.query(`INSERT INTO messages (
        createdOn, message, parentMessageId,
        receiverid, subject, senderid, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      Object.values(message));
      const draftMsg = rows[0];
      return [draftMsg];
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async deleteMessage(msg, user) {
    /* delete a draft message......... or convert unread message to draft */
    try {
      if (msg.status === 'draft') {
        await this.pool.query('DELETE FROM messages WHERE (id = $1 AND (senderid = $2 OR receiverid = $3)) RETURNING *',
          [msg.id, user.id, user.id]);
      } else if (msg.status === 'unread') {
        await this.pool.query('UPDATE messages SET status = $1 WHERE (id = $2 AND (senderid = $3 OR receiverid = $4)) RETURNING *',
          ['draft', msg.id, user.id, user.id]);
      }
      return [{ message: msg.message }];
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async createGroup(group) {
    /* create user using in user table */
    try {
      const { rows } = await this.pool.query(`INSERT INTO groups (
        name, role, userid) 
        VALUES ($1, $2, $3) RETURNING *`, [group.name, group.role, group.userid]);
      /* console.log(rows, group);
      const members = await this.pool.query(`INSERT INTO groupmembers (
        groupid, role, userid)
        VALUES ($1, $2, $3) RETURNING *`, [rows[0].id, group.role, group.userid]);
      console.log(members); */
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async groupAddUser(payload) {
    /* create user using in user table */
    try {
      const { rows } = await this.pool.query(`INSERT INTO groupmembers (
        groupid, userid, role) 
        VALUES ($1, $2, $3) RETURNING *`, [payload.groupid, payload.id, 'user']);
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async groupDeleteUser(member, group) {
    /* delete a draft message......... or convert unread message to draft */
    try {
      await this.pool.query('DELETE FROM groupmembers WHERE (userid = $1 AND groupid = $2) RETURNING *',
        [member.id, group.id]);
      return [{ messages: `${member.firstname} ${member.lastname} has been deleted from ${group.name}` }];
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async getGroupMembers(id) {
    /* get all contacts */
    try {
      const { rows } = await this.pool.query(`
      SELECT groupmembers.*, groups.*, users.firstname,
      users.lastname FROM groupmembers
      INNER JOIN groups ON (groupmembers.groupid = groups.id) 
      INNER JOIN users ON (groupmembers.userid = users.id) 
      WHERE groupmembers.groupid = $1
      `, [id]);
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async deleteGroup(group) {
    /* delete a draft message......... or convert unread message to draft */
    try {
      await this.pool.query('DELETE FROM groups WHERE (id = $1)',
        [group.id]);
      return [{ message: `${group.name} has been deleted` }];
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async groupSendMsg(msg) {
    /* send message from a particular user to another */
    try {
      const now = new Date();
      const createdOn = date.format(now, 'ddd MMM DD YYYY');
      msg.createdOn = createdOn;
      msg.status = 'unread';
      msg.parentMessageId = msg.parentMessageId || null;

      let result;
      const groupMembers = await this.getGroupMembers(msg.groupid);
      if (groupMembers.length === 0) return [];
      for (let i = 0; i < groupMembers.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        result = await this.pool.query(`INSERT INTO messages (
          createdOn, message, parentMessageId,
          receiverid, subject, senderid, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [msg.createdOn, msg.message, msg.parentMessageId,
          groupMembers[i].userid, msg.subject, msg.senderid, msg.status]);
      }
      const message = _.pick(result.rows[0], ['id', 'createdOn', 'message', 'parentMessageId', 'subject', 'status']);
      return [message];
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async updateGroupById(id, group) {
    /* update a particular message */
    try {
      const { rows } = await this.pool.query(`UPDATE groups SET name = $1
      WHERE (id = $2) RETURNING *`,
      [group.name, id]);
      return rows;
    } catch (err) {
      winston.error(err);
      return 500;
    }
  }

  async resetDb() {
    /* reset db */
    await this.pool.query(`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS messages CASCADE; 
    DROP TYPE IF EXISTS _status;
    DROP TABLE IF EXISTS groups CASCADE;
    DROP TABLE IF EXISTS groupmembers CASCADE;
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
    );
    CREATE TABLE IF NOT EXISTS groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30),
      role VARCHAR(30),
      userid INTEGER,
      constraint fk_userid
      foreign key (userid) 
      REFERENCES users (id)
    );
    CREATE TABLE IF NOT EXISTS groupmembers (
      groupid INTEGER,
      userid INTEGER,
      role VARCHAR(30),
      constraint fk_userid
      foreign key (userid) 
      REFERENCES users (id),
      constraint fk_groupid
      foreign key (groupid) 
      REFERENCES groups (id)
    );
    `);
  }
}
const dbHandler = new DbHandler();
export default dbHandler;
