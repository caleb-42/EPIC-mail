export default class Model {
  constructor(pool) {
    this.connection = pool;
  }

  async find(table, body, query, key = null) {
    /* find any record in database */
    try {
      const param = [];
      if (!key) key = query;
      let str = `SELECT * FROM ${table} WHERE`;
      query.forEach((elem, index) => {
        str += ` ${elem} = $${index + 1}`;
        if (query.length - 1 > index) str += ' AND';
        param.push(body[key[index]]);
      });
      const { rows } = await this.connection.query(str, param);
      return rows[0];
    } catch (e) {
      console.error(e);
      return 500;
    }
  }

  async resetDb() {
    /* reset db */
    await this.connection.query(`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS messages CASCADE; 
    DROP TYPE IF EXISTS _status;
    DROP TABLE IF EXISTS groups CASCADE;
    DROP TABLE IF EXISTS groupmembers CASCADE;
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(30),
      lastname VARCHAR(30),
      email VARCHAR(30),
      recoveryemail VARCHAR(30),
      phonenumber VARCHAR(30),
      dp TEXT,
      resettoken TEXT,
      resetexpire TEXT,
      password TEXT
    );
    CREATE TYPE _status as enum('read', 'unread', 'draft');
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      createdon VARCHAR(30),
      senttime VARCHAR(30),
      message TEXT,
      parentmessageid VARCHAR(30),
      receiverid INTEGER,
      subject TEXT,
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
    `);
  }
}
