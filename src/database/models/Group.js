import Model from './Model';

export default class User extends Model {
  constructor(pool) {
    super(pool);
  }

  async createGroup(group) {
    /* create user using in user table */
    try {
      const { rows } = await this.connection.query(`INSERT INTO groups (
        name, role, userid) 
        VALUES ($1, $2, $3) RETURNING *`, [group.name, group.role, group.userid]);

      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async getGroups(id) {
    /* get all contacts */
    try {
      const { rows } = await this.connection.query('SELECT * FROM groups WHERE userid = $1 ORDER BY id DESC', [id]);
      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async deleteGroup(group) {
    /* delete a draft message......... or convert unread message to draft */
    try {
      await this.connection.query('DELETE FROM groups WHERE (id = $1)',
        [group.id]);
      return [{ message: `${group.name} has been deleted` }];
    } catch (err) {
      console.error(err);
      return 500;
    }
  }

  async updateGroupById(id, group) {
    /* update a particular message */
    try {
      const { rows } = await this.connection.query(`UPDATE groups SET name = $1
        WHERE (id = $2) RETURNING *`,
      [group.name, id]);
      return rows;
    } catch (err) {
      console.error(err);
      return 500;
    }
  }
}
