import _ from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import date from 'date-and-time';
import db from './db';


class DbHandler {
  constructor() {
    this.db = _.cloneDeep(db);
  }

  find(table, body, query) {
    return this.db[table].find(tab => tab[query] === body[query]);
  }

  generateJWT(user) {
    return jwt.sign({ id: user.id }, config.get('jwtPrivateKey'));
  }

  async createUser(newUser) {
    const id = (this.db.users).length + 1;
    const user = _.pick(newUser, ['firstName', 'lastName', 'email', 'phoneNumber', 'isAdmin', 'password']);
    user.id = id;
    user.isAdmin = id === 1;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    this.db.users.push(user);
    const token = this.generateJWT(user);
    return token;
  }

  async validateUser(guest, user) {
    const validPassword = await bcrypt.compare(guest.password, user.password);
    if (!validPassword) return false;
    return this.generateJWT(user);
  }

  getMessages(id) {
    const messages = this.db.messages
      .filter(message => message.senderId === id || message.receiverId === id);
    return messages;
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

  getMessageById(id) {
    const message = this.db.messages
      .find(msg => msg.id === id);
    if (!message) return false;
    return [message];
  }

  sendMessage(msg) {
    const now = new Date();
    const createdOn = date.format(now, 'ddd MMM DD YYYY');
    msg.createdOn = createdOn;
    msg.status = 'sent';
    const id = (this.db.messages).length + 1;
    msg.id = id;
    this.db.messages.push(msg);

    const sentmsg = {
      messageId: id.toString(),
      createdOn,
      receiverId: msg.receiverId,
      senderId: msg.senderId,
      mailerName: msg.mailerName,
      subject: msg.subject,
      status: 'sent',
    };
    this.db.sent.push(sentmsg);
    return [msg];
  }

  deleteMessage(id) {
    const deleteMsg = this.db.messages.find(msg => msg.id === id);
    if (!deleteMsg) return false;
    const msgType = (deleteMsg.status === 'read' || deleteMsg.status === 'unread') ? 'inbox' : deleteMsg.status;
    const newMsgArray = this.db.messages.filter(msg => msg.id !== deleteMsg.id);
    const messageId = String(deleteMsg.id);
    const newTypeMsgArray = this.db[msgType]
      .filter(msg => msg.messageId !== messageId);

    this.db.messages = newMsgArray;
    this.db[msgType] = newTypeMsgArray;
    return [{
      message: deleteMsg.message,
    }];
  }

  resetDb() {
    this.db = _.cloneDeep(db);
  }
}
const dbHandler = new DbHandler();
module.exports = dbHandler;
