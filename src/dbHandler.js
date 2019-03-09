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
    const sent = this.db.sent
      .filter(message => message.receiverId === id);
    const draft = this.db.draft
      .filter(message => message.receiverId === id);
    const inbox = this.db.inbox
      .filter(message => message.senderId === id);
    return [...inbox, ...sent, ...draft];
  }

  resetDb() {
    this.db = _.cloneDeep(db);
  }
}
const dbHandler = new DbHandler();
module.exports = dbHandler;
