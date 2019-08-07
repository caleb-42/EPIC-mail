import bcrypt from 'bcrypt';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { auth } from '../../vars';
import Model from './Model';

export default class User extends Model {
  constructor(pool) {
    super(pool);
    this.generateJWT = user => jwt.sign({ id: user.id }, auth.jwtKey);
  }

  async createUser(newUser) {
    /* create user using in user table */
    newUser.dp = 'https://epic-mail-application.herokuapp.com/uploads/2019-04-14dp.png';
    /* newUser.dp = 'http://localhost:3000/uploads/2019-04-14dp.png'; */
    const user = _.pick(newUser, ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'dp', 'recoveryEmail']);
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      const { rows } = await this.connection.query(`INSERT INTO users (
            firstName, lastName, email, phoneNumber, password, dp, recoveryEmail) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, Object.values(user));
      const createdUser = rows[0];
      const token = this.generateJWT(createdUser);
      return token;
    } catch (err) {
      console.log(err);
      return 500;
    }
  }
}
