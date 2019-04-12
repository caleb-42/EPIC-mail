/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let datecreated;
const generateBloatedMails = (obj, msg, evt) => {
  dummyData.selected = dummyData.data.find(elem => Number(elem.id) === Number(obj.getAttribute('data-id')));
  selectPost(evt.currentTarget);
  server(
    `messages/${msg.id}`, 'GET', {},
    (res) => {
      console.log(res.data[0]);
      const msgById = res.data[0];
      let msgstatus = msgById.status;
      if (localStorage.getItem('id') === String(msgById.senderid) && msgById.status !== 'draft') {
        msgstatus = msgById.status === 'read' ? 'seen' : 'delivered';
      }
      document.querySelector('.mails .content-wrapper-bloated').innerHTML = mailPostBloated(msgById, msgstatus);
      modalActivate();
    },
    (err) => {
      console.log(err);
    },
  );
};
const generateMails = (msg, index) => {
  let { status } = msg;
  if (localStorage.getItem('id') === String(msg.senderid) && msg.status !== 'draft') {
    status = msg.status === 'read' ? 'seen' : 'delivered';
  }

  datecreated = msg.createdon;
  document.querySelector('.mails .content-wrapper').insertAdjacentHTML('beforeend', mailPost(msg, index, datecreated, status));
  document.querySelector(`#post-${index}`).addEventListener('click', async (evt) => {
    generateBloatedMails(evt.currentTarget, msg, evt);
  });
};
