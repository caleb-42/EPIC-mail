CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(30),
  lastname VARCHAR(30),
  email VARCHAR(30),
  phonenumber VARCHAR(30),
  password TEXT
);
CREATE TYPE _status as enum('read', 'unread', 'draft');
  CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  createdon VARCHAR(30),
  message VARCHAR(500),
  parentmessageid VARCHAR(30),
  receiverid INTEGER,
  subject VARCHAR(30),
  senderid INTEGER,
  status _status,
  constraint fk_user
  foreign key (receiverid) 
  REFERENCES users (id)
);