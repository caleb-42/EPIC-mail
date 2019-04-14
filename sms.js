const accountSid = 'AC8bb0c0603a55fb8908035d5ad4222b5c';
const authToken = 'd28b5cd6d4e8e193d23c895bca9d32ad';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    from: '+12027592246',
    to: '+2348130439102',
  })
  .then(message => console.log(message.sid));
