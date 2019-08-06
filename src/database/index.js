import { Pool } from 'pg';
import { database } from '../vars';
import UserClass from './models/User';
import AuthClass from './models/Auth';
import GroupClass from './models/Group';
import GroupMemberClass from './models/GroupMember';
import MessageClass from './models/Message';

const pool = new Pool({
  connectionString: database.uri,
});

export default {
  User: new UserClass(pool),
  Auth: new AuthClass(pool),
  Group: new GroupClass(pool),
  GroupMember: new GroupMemberClass(pool),
  Message: new MessageClass(pool),
};
