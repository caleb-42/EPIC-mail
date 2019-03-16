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

  getUsers() {
    return this.db.users;
  }

  getMessages(id) {
    const messages = this.db.messages
      .filter(message => message.senderId === id || message.receiverId === id);
    return messages;
  }

  getInboxMessages(id, type = 'all') {
    const messages = this.db.inbox
      .filter((message) => {
        if (type === 'all') return message.receiverId === id;
        if (type === 'read') return message.receiverId === id && message.status === 'read';
        return message.receiverId === id && message.status === 'unread';
      });
    return messages;
  }

  getOutboxMessages(id, type) {
    const messages = this.db.outbox
      .filter(message => message.senderId === id && message.status === type);
    return messages;
  }

  getMessageById(id) {
    const message = this.db.messages
      .find(msg => msg.id === id);
    if (!message) return false;
    return [message];
  }

  updateMessageById(id, body) {
    const message = this.db.messages
      .find(msg => msg.id === id);
    if (!message) return false;
    message.subject = body.subject || message.subject;
    message.receiverId = body.receiverId || message.receiverId;
    message.message = body.message || message.message;
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
    this.db.outbox.push(sentmsg);
    const receivedmsg = _.cloneDeep(sentmsg);
    receivedmsg.status = 'unread';
    this.db.inbox.push(receivedmsg);
    return [msg];
  }

  deleteMessage(id, userId) {
    const deleteMsg = this.db.messages.find(msg => msg.id === id);
    if (!deleteMsg) return false;

    const messageId = String(deleteMsg.id);

    const deleteMsgDraft = this.db.outbox.find(msg => msg.messageId === messageId
                                              && msg.status === 'draft'
                                              && userId === msg.senderId);
    if (deleteMsgDraft) {
      const newMsgArray = this.db.messages.filter(msg => msg.id !== deleteMsg.id);
      this.db.messages = newMsgArray;

      const newOutboxMsgArray = this.db.outbox.filter(msg => msg.messageId !== messageId);
      this.db.outbox = newOutboxMsgArray;

      return [{
        message: deleteMsg.message,
      }];
    }

    const deleteMsgSent = this.db.outbox.find(msg => msg.messageId === messageId
                                              && msg.status === 'sent'
                                              && userId === msg.senderId);
    if (deleteMsgSent) {
      deleteMsgSent.status = 'draft';

      const newMsgArray = this.db.messages.find(msg => msg.id === deleteMsg.id);
      newMsgArray.status = 'draft';

      const newInboxMsgArray = this.db.inbox.filter(msg => msg.messageId !== messageId);
      this.db.inbox = newInboxMsgArray;

      return [{
        message: deleteMsg.message,
      }];
    }

    const deleteMsgInbox = this.db.inbox.find(msg => msg.messageId === messageId
                                              && userId === msg.receiverId);

    if (deleteMsgInbox) {
      const newInboxMsgArray = this.db.inbox.filter(msg => msg.messageId !== messageId);
      this.db.inbox = newInboxMsgArray;

      return [{
        message: deleteMsg.message,
      }];
    }
    /* return false; */
  }

  resetDb() {
    this.db = _.cloneDeep(db);
  }
}
const dbHandler = new DbHandler();
module.exports = dbHandler;
