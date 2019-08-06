import bcrypt from 'bcrypt';
import _ from 'lodash';
import Model from './Model';

export default class User extends Model {
  constructor(pool) {
    super(pool);
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
      const { rows } = await this.connection.query(str, param);

      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async getUsers(id) {
    /* get all contacts */
    try {
      const sender = await this.connection.query('SELECT users.firstname, users.lastname, users.email, users.phonenumber FROM messages INNER JOIN users ON (messages.receiverid = users.id) WHERE messages.senderid = $1 ORDER BY users.firstname DESC', [id]);
      const receiver = await this.connection.query('SELECT users.firstname, users.lastname, users.email, users.phonenumber FROM messages INNER JOIN users ON (messages.senderid = users.id) WHERE messages.receiverid = $1 ORDER BY users.firstname DESC', [id]);
      const rows = _.unionBy(sender.rows, receiver.rows, 'email');
      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }
}
