"use strict";

var db = {
  users: [{
    id: 0,
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
      password: 'admin123',
      phoneNumber: '2348130439102',
      isAdmin: true,
    }, */
  ],
  messages: [
    /* {
      id: 0,
      createdOn: '12-02-2019 09:34:00',
      subject: 'i just registered',
      recieverId: 0,
      senderId: 1,
      message: 'its so wonderful to be part of this app',
      parentMessageId: undefined,
      status: 'sent',
    }, */
  ],
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