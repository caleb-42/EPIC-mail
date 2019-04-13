[![Build Status](https://travis-ci.com/caleb-42/EPIC-mail.svg?branch=develop)](https://travis-ci.com/caleb-42/EPIC-mail)
[![Coverage Status](https://coveralls.io/repos/github/caleb-42/EPIC-mail/badge.svg?branch=develop)](https://coveralls.io/github/caleb-42/EPIC-mail?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/def99768aa40062abf40/maintainability)](https://codeclimate.com/github/caleb-42/EPIC-mail/maintainability)

# EPIC-mail
Epic mail is an app that will cater for the messaging needs of users who sign up to it


# Template URL
https://caleb-42.github.io/EPIC-mail/UI

# Built with

1. HTML 
2. CSS
3. Javascript

# Api URL

- https://epic-mail-application.herokuapp.com/

# Api Documentation

- https://epic-mail-application.herokuapp.com/api-docs

# How to get a local copy

##### Clone 
- Download and install postgres sql database
- Create 'epicmailtest' database in postgreSQL with super admin role
- Copy repository link
- Create a folder location in your computer eg my/path/
- cd my/path/
- git clone repository link.git
- cd EPIC-mail
- run the commands:
- npm install
- npm run migrate
- set NODE_ENV=testing (for windows users) / $export NODE_ENV=testing (for Mac users)
- npm run dev
- open index.html file
- Sign-up with any dummy info within the inputs listed

# Routes

### Auth
- POST https://epic-mail-application.herokuapp.com/api/v1/auth/signup - Create a new user / Signs up a new user
- POST https://epic-mail-application.herokuapp.com/api/v1/auth/login - Signs in a user

##Contacts
- GET https://epic-mail-application.herokuapp.com/api/v1/users/contacts - Gets a contacts for a user

### Messages
- GET https://epic-mail-application.herokuapp.com/api/v1/messages - List all received messages
- POST https://epic-mail-application.herokuapp.com/api/v1/messages/ - Send a newly created message
- POST https://epic-mail-application.herokuapp.com/api/v1/messages/save - Saves a draft message
- GET https://epic-mail-application.herokuapp.com/api/v1/messages/all - List all messages
- GET https://epic-mail-application.herokuapp.com/api/v1/messages/read - List all read messages
- GET https://epic-mail-application.herokuapp.com/api/v1/messages/sent - List all sent messages
- GET https://epic-mail-application.herokuapp.com/api/v1/messages/unread - List all unread messages
- GET https://epic-mail-application.herokuapp.com/api/v1/messages/draft - List all draft messages
- GET https://epic-mail-application.herokuapp.com/api/v1/messages/:id - Gets message by id
- POST https://epic-mail-application.herokuapp.com/api/v1/messages/:id - Sends a Draft message by id
- PATCH https://epic-mail-application.herokuapp.com/api/v1/messages/:id - Updates message by id
- DELETE https://epic-mail-application.herokuapp.com/api/v1/messages/:id - Deletes message by id


### Groups
- POST https://epic-mail-application.herokuapp.com/api/v1/groups - Create new group
- GET https://epic-mail-application.herokuapp.com/api/v1/groups - Gets all groups
- POST https://epic-mail-application.herokuapp.com/api/v1/groups/:id/users - Create a group member for a particular group
- GET https://epic-mail-application.herokuapp.com/api/v1/groups/:id/users - Gets all group members for a particular group
- PATCH https://epic-mail-application.herokuapp.com/api/v1/groups/:id/name - Edit group name by id
- DELETE https://epic-mail-application.herokuapp.com/api/v1/groups/:id - Deletes group by id
- DELETE https://epic-mail-application.herokuapp.com/api/v1/groups/:groupid/users/:userid - Deletes member of group by group id and member id
- POST https://epic-mail-application.herokuapp.com/api/v1/groups/:id/messages - Send message to all members of a group
