"use strict";

var db = {
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
    id: 0,
    createdOn: '12-02-2019 09:34:00',
    subject: 'i just registered',
    recieverId: 1,
    senderId: 2,
    recieverName: 'admin user',
    senderName: 'paul jekande',
    message: 'its so wonderful to be part of this app',
    parentMessageId: undefined,
    status: 'unread'
  }, {
    id: 0,
    createdOn: 'Tue 5th, Feb 2012',
    recieverId: 1,
    senderId: 2,
    recieverName: 'admin user',
    senderName: 'mikel obi',
    subject: 'you didnt win',
    message: 'the match was a draw stop kidding yourself, we played better',
    parentMessageId: undefined,
    status: 'received'
  }, {
    id: 0,
    createdOn: 'Sun 11th, Aug 2018',
    recieverId: 2,
    senderId: 1,
    recieverName: 'fred delight',
    senderName: 'admin user',
    subject: "get in the car, you're late",
    message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    parentMessageId: undefined,
    status: 'sent'
  }, {
    id: 0,
    createdOn: 'Thu 23rd, Jan 2019',
    recieverId: 1,
    senderId: 2,
    recieverName: 'admin user',
    senderName: 'fred delight',
    subject: 'hello, missed your call',
    message: "I'm so sorry, i was at the inn when you called martins, Lorem Ipsum is simply dummy text",
    parentMessageId: undefined,
    status: 'read'
  }, {
    id: 0,
    createdOn: 'Wed 30th, Dec 2002',
    recieverId: 2,
    senderId: 1,
    recieverName: 'okoro stephen',
    senderName: 'admin user',
    subject: 'u ahave come again abi',
    message: 'i told you to stop coming to this office',
    parentMessageId: undefined,
    status: 'sent'
  }, {
    id: 0,
    createdOn: 'Sat 23rd, Jun 2015',
    recieverId: 2,
    senderId: 1,
    recieverName: 'martins sultan',
    senderName: 'admin user',
    subject: 'the staff meeting',
    message: 'dont let the board members get on your nerves they have terrible manners',
    parentMessageId: undefined,
    status: 'draft'
  }, {
    id: 0,
    createdOn: 'Tue 5th, Feb 2012',
    recieverId: 1,
    senderId: 2,
    recieverName: 'admin  user',
    senderName: 'micheal jackson',
    subject: 'you are very wrong',
    message: "i am not dead, i just got beamed back into the 80's, i'll be back for all you haters",
    parentMessageId: undefined,
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

var reset = function reset() {
  db.users = [{
    id: 0,
    email: 'admin@gmail.com',
    firstName: 'admin',
    lastName: 'user',
    password: 'admin123',
    phoneNumber: '2348130439102',
    isAdmin: true
  }];
  db.contacts = [];
  db.messages = [];
  db.groups = [];
  db.groupMembers = [];
};

module.exports = {
  db: db,
  reset: reset
};