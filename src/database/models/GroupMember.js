import _ from 'lodash';
import date from 'date-and-time';
import Model from './Model';

export default class User extends Model {
  constructor(pool) {
    super(pool);
  }

  async groupAddUser(payload) {
    /* create user using in user table */
    try {
      await this.connection.query(`INSERT INTO groupmembers (
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
      await this.connection.query('DELETE FROM groupmembers WHERE (userid = $1 AND groupid = $2) RETURNING *',
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
      const { rows } = await this.connection.query(`
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
        result = await this.connection.query(`INSERT INTO messages (
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
}
