import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const helpers = {

  generateJWT: user => jwt.sign({ id: user.id }, process.env.jwtPrivateKey),

};

export default helpers;
