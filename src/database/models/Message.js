import date from 'date-and-time';
import _ from 'lodash';
import Model from './Model';

export default class User extends Model {
  constructor(pool) {
    super(pool);
  }

  async getMessages(id) {
    /* get all received messages for a particular user */
    try {
      const sender = await this.connection.query('SELECT messages.*, users.firstname, users.lastname, users.dp FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE messages.receiverid = $1 AND messages.visible != $2 ORDER BY id DESC;', [id, 'sender']);
      const receiver = await this.connection.query('SELECT messages.*, users.firstname, users.lastname, users.dp FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.senderid = $1 AND messages.visible != $2 ORDER BY id DESC;', [id, 'receiver']);
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
        const { rows } = await this.connection.query('SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE receiverid = $1 AND messages.visible != $2 ORDER BY id DESC', [id, 'sender']);
        return rows;
      }
      const { rows } = await this.connection.query('SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE receiverid = $1 AND status = $2 AND messages.visible != $3 ORDER BY id DESC', [id, type, 'sender']);
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
        const withReceiver = await this.connection.query('SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.senderId = $1 AND messages.status = $2 AND messages.visible != $3 ORDER BY id DESC', [id, 'draft', 'receiver']);
        return [...withReceiver.rows];
      }
      const { rows } = await this.connection.query('SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.senderId = $1 AND (messages.status = $2 OR messages.status = $3) AND messages.visible != $4 ORDER BY id DESC', [id, 'unread', 'read', 'receiver']);
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
      const { rows } = await this.connection.query(`SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages
        INNER JOIN users ON (messages.${fromTo}id = users.id)
        WHERE messages.id = $1
        AND ((messages.receiverid = $2 AND messages.visible != $3)
        OR (messages.senderid = $4 AND messages.visible != $5))`,
      [findMsg.id, userId, 'sender', userId, 'receiver']);

      if (rows.length === 0) return rows;
      if (rows[0].receiverid === userId) {
        await this.connection.query(`UPDATE messages SET status = $1
          WHERE (id = $2) RETURNING *`, ['read', findMsg.id]);
        rows[0].status = 'read';
      }

      const thread = await this.connection.query('SELECT messages.*, users.firstname, users.lastname, users.email, users.dp FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE ((messages.receiverid = $1 AND messages.visible != $2) OR (messages.senderid = $3 AND messages.visible != $4)) AND messages.parentmessageid = $5 ORDER BY id DESC;', [userId, 'sender', userId, 'receiver', String(findMsg.id)]);

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

      const { rows } = await this.connection.query(`UPDATE messages SET message = $1, receiverid = $2, subject = $3
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
      const { rows } = await this.connection.query(`INSERT INTO messages (
        createdOn, sentTime, message, parentMessageId,
        receiverid, subject, senderid, status, visible
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      Object.values(message));

      if (msg.parentMessageId) {
        const parentMsgRes = await this.connection.query('UPDATE messages SET status = $1 WHERE (id = $2) RETURNING *',
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
      const { rows } = await this.connection.query('UPDATE messages SET status = $1, createdOn = $2, sentTime = $3, visible = $4 WHERE (id = $5) RETURNING *',
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
      const { rows } = await this.connection.query(`INSERT INTO messages (
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
        await this.connection.query('DELETE FROM messages WHERE (id = $1 AND (senderid = $2 OR receiverid = $3)) RETURNING *',
          [msg.id, user.id, user.id]);
        message = 'message has been deleted';
      }
      if (msg.senderid === user.id && msg.status === 'unread') {
        await this.connection.query('UPDATE messages SET status = $1, visible = $2 WHERE (id = $3 AND senderid = $4) RETURNING *',
          ['draft', 'sender', msg.id, user.id]);
        message = 'message has been retracted';
      }

      if (msg.senderid === user.id && msg.status !== 'draft' && msg.visible === 'sender') {
        await this.connection.query('DELETE FROM messages WHERE (id = $1 AND senderid = $2) RETURNING *',
          [msg.id, user.id]);
        message = 'message has been deleted';
      } else if (msg.senderid === user.id && msg.status === 'read' && msg.visible === 'all') {
        await this.connection.query('UPDATE messages SET visible = $1 WHERE (id = $2 AND senderid = $3) RETURNING *',
          ['receiver', msg.id, user.id]);
        message = 'message has been deleted';
      }

      if (msg.receiverid === user.id && msg.status !== 'draft' && msg.visible === 'receiver') {
        await this.connection.query('DELETE FROM messages WHERE (id = $1 AND receiverid = $2) RETURNING *',
          [msg.id, user.id]);
        message = 'message has been deleted';
      } else if (msg.receiverid === user.id && msg.status === 'read' && msg.visible === 'all') {
        await this.connection.query('UPDATE messages SET visible = $1 WHERE (id = $2 AND receiverid = $3) RETURNING *',
          ['sender', msg.id, user.id]);
        message = 'message has been deleted';
      }
      return [{ message }];
    } catch (err) {
      console.error(err);
      return 500;
    }
  }
}
