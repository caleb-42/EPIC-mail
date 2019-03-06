import _ from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { db } from './db';

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
    const messages = this.db.messages
      .filter(message => message.senderId === id
     || message.receiverId === id);
    return messages;
  }

  resetDb() {
    this.db = _.cloneDeep(db);
  }
}
const dbHandler = new DbHandler();
module.exports = dbHandler;
