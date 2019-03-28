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
  visible VARCHAR(30),
  senderid INTEGER,
  status _status,
  constraint fk_user
  foreign key (receiverid) 
  REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  role VARCHAR(30),
  userid INTEGER,
  constraint fk_userid
  foreign key (userid) 
  REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS groupmembers (
  groupid INTEGER,
  userid INTEGER,
  role VARCHAR(30),
  constraint fk_userid
  foreign key (userid) 
  REFERENCES users (id),
  constraint fk_groupid
  foreign key (groupid) 
  REFERENCES groups (id)
);