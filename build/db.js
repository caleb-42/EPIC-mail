"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _config = _interopRequireDefault(require("config"));

var testDb = {
  users: [],
  contacts: [],
  messages: [],
  sent: [],
  draft: [],
  inbox: [],
  groups: [],
  groupMembers: []
};
var prodDb = {
  users: [{
    id: 1,
    email: 'admin@gmail.com',
    firstName: 'admin',
    lastName: 'user',
    password: 'admin123',
    phoneNumber: '2348130439102',
    isAdmin: true
  }],
  contacts: [],
  messages: [],
  sent: [],
  draft: [],
  inbox: [],
  groups: [],
  groupMembers: []
};
var devDb = {
  users: [{
    id: 1,
    email: 'admin@gmail.com',
    firstName: 'admin',
    lastName: 'user',
    password: 'admin123',
    phoneNumber: '2348130439102',
    isAdmin: true
  }],
  contacts: [
    /* {
      id: 0,
      email: 'admin@gmail.com',
      firstName: 'admin',
      lastName: 'user',
      phoneNumber: '2348130439102',
    }, */
  ],
  messages: [{
    id: 1,
    createdOn: 'Sat 18th, Mar 2011',
    subject: 'i just registered',
    receiverId: 2,
    senderId: 1,
    mailerName: 'paul jekande',
    message: 'its so wonderful to be part of this app',
    parentMessageId: undefined,
    status: 'unread'
  }, {
    id: 2,
    createdOn: 'Tue 5th, Feb 2012',
    receiverId: 2,
    senderId: 1,
    mailerName: 'mikel obi',
    subject: 'you didnt win',
    message: 'the match was a draw stop kidding yourself, we played better',
    parentMessageId: undefined,
    status: 'unread'
  }, {
    id: 3,
    createdOn: 'Sun 11th, Aug 2018',
    receiverId: 1,
    senderId: 2,
    mailerName: 'fred delight',
    subject: "get in the car, you're late",
    message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    parentMessageId: undefined,
    status: 'sent'
  }, {
    id: 4,
    createdOn: 'Thu 23rd, Jan 2019',
    receiverId: 2,
    senderId: 1,
    mailerName: 'fred delight',
    subject: 'hello, missed your call',
    message: "I'm so sorry, i was at the inn when you called martins, Lorem Ipsum is simply dummy text",
    parentMessageId: undefined,
    status: 'read'
  }, {
    id: 5,
    createdOn: 'Wed 30th, Dec 2002',
    receiverId: 1,
    senderId: 2,
    mailerName: 'okoro stephen',
    subject: 'u ahave come again abi',
    message: 'i told you to stop coming to this office',
    parentMessageId: undefined,
    status: 'sent'
  }, {
    id: 6,
    createdOn: 'Sat 23rd, Jun 2015',
    receiverId: undefined,
    senderId: 2,
    mailerName: '',
    subject: 'the staff meeting',
    message: 'dont let the board members get on your nerves they have terrible manners',
    parentMessageId: undefined,
    status: 'draft'
  }, {
    id: 7,
    createdOn: 'Tue 5th, Feb 2012',
    receiverId: 2,
    senderId: 1,
    mailerName: 'micheal jackson',
    subject: 'you are very wrong',
    message: "i am not dead, i just got beamed back into the 80's, i'll be back for all you haters",
    parentMessageId: undefined,
    status: 'read'
  }, {
    id: 8,
    createdOn: 'Mon 2nd, Oct 2018',
    receiverId: 1,
    senderId: 2,
    mailerName: 'patrick ogbayagbon',
    subject: 'it is a pittiable bismal bismal',
    message: 'the city is a state of crungaga dongaga paripasu padi pa. where the microscopic few have chosen to rise above nagum sidam in order to acheive opiate success',
    parentMessageId: undefined,
    status: 'draft'
  }],
  sent: [{
    messageId: '3',
    createdOn: 'Sun 11th, Aug 2018',
    receiverId: 1,
    senderId: 2,
    mailerName: 'fred delight',
    subject: "get in the car, you're late",
    status: 'sent'
  }, {
    messageId: '5',
    createdOn: 'Wed 30th, Dec 2002',
    receiverId: 1,
    senderId: 2,
    mailerName: 'okoro stephen',
    subject: 'u ahave come again abi',
    status: 'sent'
  }],
  draft: [{
    messageId: '6',
    createdOn: 'Sat 23rd, Jun 2015',
    receiverId: undefined,
    senderId: 2,
    mailerName: '',
    subject: 'the staff meeting',
    status: 'draft'
  }, {
    messageId: '8',
    createdOn: 'Mon 2nd, Oct 2018',
    receiverId: 1,
    senderId: 2,
    mailerName: 'patrick ogbayagbon',
    subject: 'it is a pittiable bismal bismal',
    status: 'draft'
  }],
  inbox: [{
    messageId: '1',
    createdOn: 'Sat 18th, Mar 2011',
    subject: 'i just registered',
    receiverId: 2,
    senderId: 1,
    mailerName: 'paul jekande',
    status: 'unread'
  }, {
    messageId: '2',
    createdOn: 'Tue 5th, Feb 2012',
    receiverId: 2,
    senderId: 1,
    mailerName: 'mikel obi',
    subject: 'you didnt win',
    status: 'unread'
  }, {
    messageId: '4',
    createdOn: 'Thu 23rd, Jan 2019',
    receiverId: 2,
    senderId: 1,
    mailerName: 'fred delight',
    subject: 'hello, missed your call',
    status: 'read'
  }, {
    messageId: '7',
    createdOn: 'Tue 5th, Feb 2012',
    receiverId: 2,
    senderId: 1,
    mailerName: 'micheal jackson',
    subject: 'you are very wrong',
    status: 'read'
  }],
  groups: [
    /* {
      id: 0,
      name: 'coders',
      createdBy: 'admin',
    }, */
  ],
  groupMembers: [
    /* {
      groupId: 0,
      memberId: 1,
    }, */
  ]
};

var dbaseEnv = _config.default.get('database');

var db = {
  prodDb: prodDb,
  testDb: testDb,
  devDb: devDb
};
module.exports = db[dbaseEnv];