import jwt from 'jsonwebtoken';
import config from 'config';

const helpers = {

  generateJWT: user => jwt.sign({ id: user.id }, config.get('jwtPrivateKey')),

};

export default helpers;
