import _ from 'lodash';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import date from 'date-and-time';
import { database } from '../vars';
import helper from '../utilities';

class DbHandler {
  constructor() {
    this.pool = new Pool({
      connectionString: database.uri,
    });
  }

  async find(table, body, query, key = null) {
    /* find any record in database */
    try {
      const param = [];
      if (!key) key = query;
      let str = `SELECT * FROM ${table} WHERE`;
      query.forEach((elem, index) => {
        str += ` ${elem} = $${index + 1}`;
        if (query.length - 1 > index) str += ' AND';
        param.push(body[key[index]]);
      });
      const { rows } = await this.pool.query(str, param);
      return rows[0];
    } catch (e) {
      console.error(e);
      return 500;
    }
  }

  async createUser(newUser) {
    /* create user using in user table */
    newUser.dp = 'https://epic-mail-application.herokuapp.com/uploads/2019-04-14dp.png';
    /* newUser.dp = 'http://localhost:3000/uploads/2019-04-14dp.png'; */
    const user = _.pick(newUser, ['email', 'password', 'dp', 'recoveryEmail', 'firstName', 'lastName']);
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      const { rows } = await this.pool.query(`INSERT INTO users (
        email, password, dp, recoveryEmail, firstName, lastName) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, Object.values(user));
      const createdUser = rows[0];
      const token = helper.generateJWT(createdUser);
      return token;
    } catch (err) {
      console.log(err);
      return 500;
    }
  }

  async updateUser(id, query) {
    if (query.password) {
      const salt = await bcrypt.genSalt(10);
      query.password = await bcrypt.hash(query.password, salt);
    }
    try {
      const keys = Object.keys(query);
      const param = [];
      let str = 'UPDATE users SET ';
      keys.forEach((elem, index) => {
        str += ` ${elem} = $${index + 1}`;
        if (keys.length - 1 > index) str += ' ,';
        console.log(query[elem]);
        param.push(query[elem]);
      });
      str += ` WHERE (id= $${param.length + 1}) RETURNING users.firstname, users.lastname, users.email, users.phonenumber, users.dp, users.recoveryemail`;
      param.push(id);
      const { rows } = await this.pool.query(str, param);

      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async getUsers(id) {
    /* get all contacts */
    try {
      const sender = await this.pool.query('SELECT users.firstname, users.lastname, users.email, users.phonenumber FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.senderid = $1 ORDER BY users.firstname DESC', [id]);
      const receiver = await this.pool.query('SELECT users.firstname, users.lastname, users.email, users.phonenumber FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE messages.receiverid = $1 ORDER BY users.firstname DESC', [id]);
      const rows = _.unionBy(sender.rows, receiver.rows, 'email');
      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async getGroups(id) {
    /* get all contacts */
    try {
      const { rows } = await this.pool.query('SELECT * FROM groups WHERE userid = $1 ORDER BY id DESC', [id]);
      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async getMessages(id) {
    /* get all received messages for a particular user */
    try {
      const sender = await this.pool.query('SELECT messages.*, users.firstname, users.lastname, users.dp FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE messages.receiverid = $1 AND messages.visible != $2 ORDER BY id DESC;', [id, 'sender']);
      const receiver = await this.pool.query('SELECT messages.*, users.firstname, users.lastname, users.dp FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.senderid = $1 AND messages.visible != $2 ORDER BY id DESC;', [id, 'receiver']);
      const rows = [...sender.rows, ...receiver.rows];

      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async getInboxMessages(id, type = 'all') {
    /* get all messages for a particular user */
    try {
      if (type === 'all') {
        const { rows } = await this.pool.query('SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE receiverid = $1 AND messages.visible != $2 ORDER BY id DESC', [id, 'sender']);
        return rows;
      }
      const { rows } = await this.pool.query('SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE receiverid = $1 AND status = $2 AND messages.visible != $3 ORDER BY id DESC', [id, type, 'sender']);
      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async getOutboxMessages(id, type) {
    /* get either draft or sent messages */
    try {
      if (type === 'draft') {
        const withReceiver = await this.pool.query('SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.senderId = $1 AND messages.status = $2 AND messages.visible != $3 ORDER BY id DESC', [id, 'draft', 'receiver']);
        return [...withReceiver.rows];
      }
      const { rows } = await this.pool.query('SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.senderId = $1 AND (messages.status = $2 OR messages.status = $3) AND messages.visible != $4 ORDER BY id DESC', [id, 'unread', 'read', 'receiver']);
      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async getMessageById(findMsg, userId) {
    /* get a particular message */
    const fromTo = findMsg.receiverid === userId ? 'sender' : 'receiver';
    try {
      const { rows } = await this.pool.query(`SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages
        INNER JOIN users ON (messages.${fromTo}id = users.id)
        WHERE messages.id = $1
        AND ((messages.receiverid = $2 AND messages.visible != $3)
        OR (messages.senderid = $4 AND messages.visible != $5))`,
        [findMsg.id, userId, 'sender', userId, 'receiver']);

      if (rows.length === 0) return rows;
      if (rows[0].receiverid === userId) {
        await this.pool.query(`UPDATE messages SET status = $1
          WHERE (id = $2) RETURNING *`, ['read', findMsg.id]);
        rows[0].status = 'read';
      }

      const thread = await this.pool.query('SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE ((messages.receiverid = $1 AND messages.visible != $2) OR (messages.senderid = $3 AND messages.visible != $4)) AND messages.parentmessageid = $5 ORDER BY id DESC;', [userId, 'sender', userId, 'receiver', String(findMsg.id)]);

      rows[0].thread = thread.rows;
      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async updateMessageById(req, msg) {
    /* update a particular message */
    try {
      const message = req.message || msg.message;
      let receiverId;
      if (req.email) {
        const receiver = await this.find('users', { email: req.email }, ['email']);
        receiverId = receiver.id;
      } else {
        receiverId = msg.receiverid;
      }
      const subject = req.subject || msg.subject;

      const { rows } = await this.pool.query(`UPDATE messages SET message = $1, receiverid = $2, subject = $3
      WHERE (id = $4) RETURNING *`,
        [message, receiverId, subject, msg.id]);

      const msgId = await this.getMessageById(rows[0], rows[0].senderid);

      return msgId;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async sendMessage(msg) {
    /* send message from a particular user to another */
    try {
      const now = new Date();
      msg.createdOn = date.format(now, 'ddd MMM DD YYYY');
      msg.sentTime = date.format(now, 'HH:mm');
      msg.status = 'unread';
      if (!msg.parentMessageId) msg.parentMessageId = null;
      msg.visible = 'all';

      const message = _.pick(msg, ['createdOn', 'sentTime', 'message', 'parentMessageId', 'receiverId', 'subject', 'senderId', 'status', 'visible']);
      const { rows } = await this.pool.query(`INSERT INTO messages (
        createdOn, sentTime, message, parentMessageId,
        receiverid, subject, senderid, status, visible
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        Object.values(message));

      if (msg.parentMessageId) {
        const parentMsgRes = await this.pool.query('UPDATE messages SET status = $1 WHERE (id = $2) RETURNING *',
          ['read', Number(msg.parentMessageId)]);
        const parentMsg = parentMsgRes.rows;
        const msgId = await this.getMessageById(parentMsg[0], rows[0].senderid);
        return msgId;
      }

      const sentMsg = rows[0];
      return [sentMsg];
    } catch (err) {
      console.error(err.stack);
      return 500;
    }
  }

  async sendDraftMessage(msg) {
    const now = new Date();
    const createdOn = date.format(now, 'ddd MMM DD YYYY');
    const sentTime = date.format(now, 'HH:mm');
    try {
      const { rows } = await this.pool.query('UPDATE messages SET status = $1, createdOn = $2, sentTime = $3, visible = $4 WHERE (id = $5) RETURNING *',
        ['unread', createdOn, sentTime, 'all', msg.id]);
      const sentMsg = rows[0];
      return [sentMsg];
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async saveMessage(msg) {
    /* creat a draft message */
    try {
      const now = new Date();
      msg.createdOn = date.format(now, 'ddd MMM DD YYYY');
      msg.sentTime = date.format(now, 'HH:mm');
      msg.status = 'draft';
      msg.parentMessageId = msg.parentMessageId || null;
      msg.receiverId = msg.receiverId || null;
      msg.visible = 'sender';

      const message = _.pick(msg, ['createdOn', 'sentTime', 'message', 'parentMessageId', 'receiverId', 'subject', 'senderId', 'status', 'visible']);
      const { rows } = await this.pool.query(`INSERT INTO messages (
        createdOn, sentTime, message, parentMessageId,
        receiverid, subject, senderid, status, visible
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        Object.values(message));
      const draftMsg = rows[0];
      return [draftMsg];
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async deleteMessage(msg, user) {
    /* delete a draft message......... or convert unread message to draft */
    let message;
    try {
      if (msg.status === 'draft') {
        await this.pool.query('DELETE FROM messages WHERE (id = $1 AND (senderid = $2 OR receiverid = $3)) RETURNING *',
          [msg.id, user.id, user.id]);
        message = 'message has been deleted';
      }
      if (msg.senderid === user.id && msg.status === 'unread') {
        await this.pool.query('UPDATE messages SET status = $1, visible = $2 WHERE (id = $3 AND senderid = $4) RETURNING *',
          ['draft', 'sender', msg.id, user.id]);
        message = 'message has been retracted';
      }

      if (msg.senderid === user.id && msg.status !== 'draft' && msg.visible === 'sender') {
        await this.pool.query('DELETE FROM messages WHERE (id = $1 AND senderid = $2) RETURNING *',
          [msg.id, user.id]);
        message = 'message has been deleted';
      } else if (msg.senderid === user.id && msg.status === 'read' && msg.visible === 'all') {
        await this.pool.query('UPDATE messages SET visible = $1 WHERE (id = $2 AND senderid = $3) RETURNING *',
          ['receiver', msg.id, user.id]);
        message = 'message has been deleted';
      }

      if (msg.receiverid === user.id && msg.status !== 'draft' && msg.visible === 'receiver') {
        await this.pool.query('DELETE FROM messages WHERE (id = $1 AND receiverid = $2) RETURNING *',
          [msg.id, user.id]);
        message = 'message has been deleted';
      } else if (msg.receiverid === user.id && msg.status === 'read' && msg.visible === 'all') {
        await this.pool.query('UPDATE messages SET visible = $1 WHERE (id = $2 AND receiverid = $3) RETURNING *',
          ['sender', msg.id, user.id]);
        message = 'message has been deleted';
      }
      return [{ message }];
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async createGroup(group) {
    /* create user using in user table */
    try {
      const { rows } = await this.pool.query(`INSERT INTO groups (
        name, role, userid) 
        VALUES ($1, $2, $3) RETURNING *`, [group.name, group.role, group.userid]);

      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async groupAddUser(payload) {
    /* create user using in user table */
    try {
      await this.pool.query(`INSERT INTO groupmembers (
        groupid, userid, role) 
        VALUES ($1, $2, $3) RETURNING *`, [payload.groupid, payload.id, 'user']);
      const rows = await this.getGroupMembers(payload.groupid);
      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async groupDeleteUser(member, group) {
    /* delete a draft message......... or convert unread message to draft */
    try {
      await this.pool.query('DELETE FROM groupmembers WHERE (userid = $1 AND groupid = $2) RETURNING *',
        [member.userid, group.id]);
      return [{ message: `member has been deleted from ${group.name}` }];
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async getGroupMembers(id) {
    /* get all contacts */
    try {
      const { rows } = await this.pool.query(`
      SELECT users.id, groupmembers.groupid, users.firstname,
      users.lastname, users.email, users.dp FROM groupmembers
      INNER JOIN groups ON (groupmembers.groupid = groups.id) 
      INNER JOIN users ON (groupmembers.userid = users.id) 
      WHERE groupmembers.groupid = $1
      `, [id]);
      return rows;
    } catch (err) {
      console.error(err);
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
      console.error(err);
      return 500;
    }
  }

  async groupSendMsg(msg) {
    /* send message from a particular user to another */
    try {
      const now = new Date();
      const createdOn = date.format(now, 'ddd MMM DD YYYY');
      msg.sentTime = date.format(now, 'HH:mm');
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
          receiverid, subject, senderid, status, senttime, visible
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [msg.createdOn, msg.message, msg.parentMessageId,
          groupMembers[i].id, msg.subject, msg.senderid, msg.status, msg.sentTime, 'all']);
      }
      const message = _.pick(result.rows[0], ['id', 'createdOn', 'message', 'parentMessageId', 'subject', 'status']);
      return [message];
    } catch (err) {
      console.error(err);
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
      console.error(err);
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
      recoveryemail VARCHAR(30),
      phonenumber VARCHAR(30),
      dp TEXT,
      resettoken TEXT,
      resetexpire TEXT,
      password TEXT
    );
    CREATE TYPE _status as enum('read', 'unread', 'draft');
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      createdon VARCHAR(30),
      senttime VARCHAR(30),
      message TEXT,
      parentmessageid VARCHAR(30),
      receiverid INTEGER,
      subject TEXT,
      visible VARCHAR(30),
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
