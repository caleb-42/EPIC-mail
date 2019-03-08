import _ from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import db from './db';


class DbHandler {
  constructor() {
    this.db = _.cloneDeep(db);
  }

  find(table, body, query) {
    return this.db[table].find(tab => tab[query] === body[query]);
  }

  async createUser(newUser) {
    const id = (this.db.users).length + 1;
    const user = _.pick(newUser, ['firstName', 'lastName', 'email', 'phoneNumber', 'isAdmin', 'password']);
    user.id = id;
    user.isAdmin = id === 1;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    this.db.users.push(user);
    const token = jwt.sign({ id: user.id }, config.get('jwtPrivateKey'));
    return token;
  }

  async validateUser(guest, user) {
    const validPassword = await bcrypt.compare(guest.password, user.password);
    if (!validPassword) {
      return false;
    }
    return jwt.sign({ id: user.id }, config.get('jwtPrivateKey'));
  }

  getMessages(id) {
    const sent = this.db.sent
      .filter(message => message.receiverId === id);
    const draft = this.db.draft
      .filter(message => message.receiverId === id);
    const inbox = this.db.inbox
      .filter(message => message.senderId === id);
    return [...inbox, ...sent, ...draft];
  }

  getMessageById(msgId) {
    const msg = this.db.messages
      .find(message => message.id === msgId);
    return msg;
  }

  getReceivedMessages(id, type = 'all') {
    const messages = this.db.inbox
      .filter((message) => {
        if (type === 'all') return message.receiverId === id;
        if (type === 'read') return message.receiverId === id && message.status === 'read';
        return message.receiverId === id && message.status === 'unread';
      });
    return messages;
  }

  getSentMessages(id) {
    const messages = this.db.sent
      .filter(message => message.senderId === id);
    return messages;
  }

  getDraftMessages(id) {
    const messages = this.db.draft
      .filter(message => message.senderId === id);
    return messages;
  }

  resetDb() {
    this.db = _.cloneDeep(db);
  }
}
const dbHandler = new DbHandler();
module.exports = dbHandler;