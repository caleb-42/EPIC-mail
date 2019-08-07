import dotenv from 'dotenv';

dotenv.config();

export const client = {
  uri: process.env.CLIENT || 'http://localhost:8080',
};
export const host = {
  port: process.env.PORT || 3000,
  url: process.env.APP_URL || 'http://localhost:3000',
};
export const database = {
  uri: process.env.DATABASE_URL || 'postgresql://postgres:@localhost:5432/epicmail',
};
export const auth = {
  jwtKey: process.env.jwtPrivateKey || 'epic',
};
export const env = {
  env: process.env.NODE_ENV || 'development',
};
export const twilioAccount = {
  id: process.env.twilioAccountSid || '',
  token: process.env.twilioAuthToken || '',
};
export const mail = {
  address: process.env.EMAIL_ADDRESS || '',
  password: process.env.EMAIL_PASSWORD || '',
};
