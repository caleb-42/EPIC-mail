/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let datecreated;
const generateBloatedMails = (obj, msg) => {
  dummyData.selected = dummyData.data.find(elem => Number(elem.id) === Number(obj.getAttribute('data-id')));
  selectPost(evt);
  server(
    `messages/${msg.id}`, 'GET', {},
    (res) => {
      const msgById = res.data[0];
      let msgstatus = msgById.status;
      if (localStorage.getItem('id') === String(msgById.senderid) && msgById.status !== 'draft') {
        msgstatus = msgById.status === 'read' ? 'seen' : 'delivered';
      }
      document.querySelector('.content-wrapper-bloated').innerHTML = mailPostBloated(msgById, msgstatus);
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
  document.querySelector('.content-wrapper').insertAdjacentHTML('beforeend', mailPost(msg, index, datecreated, status));
  document.querySelector(`#post-${index}`).addEventListener('click', async (evt) => {
    generateBloatedMails(evt.currentTarget, msg);
  });
};
const msgReceiver = (obj) => {
  switch (obj.value) {
    case 'stranger':
      document.querySelector('.newMailModal .input-group').innerHTML = strangerEmailField;
      switchClass('.actionMail.save', 'gone', 'remove');
      labelShow();
      break;
    case 'contact':
      server(
        'users/contacts', 'GET', {},
        (res) => {
          document.querySelector('.newMailModal .input-group').innerHTML = contactEmailField(res.data);
          switchClass('.actionMail.save', 'gone', 'remove');
        },
        (err) => {
          console.log(err);
        },
      );
      break;
    case 'group':
      server(
        'groups', 'GET', {},
        (res) => {
          document.querySelector('.newMailModal .input-group').innerHTML = groupIdField(res.data);
          switchClass('.actionMail.save', 'gone', 'add');
        },
        (err) => {
          console.log(err);
        },
      );
      break;
    default:
  }
};

const actionMail = (obj) => {
  const formObj = formToJson(document.querySelector('.newMailModal .form-hd'));
  let endpoint = 'messages';
  const { email, subject, message } = formObj;
  let payload = { email, subject, message };
  let response = 'messages sent successfully';
  let method = 'POST';
  toggleLoader('.actionMail', '.res');
  switch (obj.textContent) {
    case 'save':
      delete formObj.msgto;
      endpoint = 'messages/save';
      payload = formObj;
      response = 'messages saved successfully';
      method = 'POST';
      break;
    case 'update':
      endpoint = `messages/${dummyData.selected.id}`;
      payload = { email: formObj.email, subject: formObj.subject, message: formObj.message };
      response = 'messages updated successfully';
      method = 'PATCH';
      break;
    default:
      if (obj.textContent === 'send' && formObj.msgto === 'group') {
        endpoint = `groups/${formObj.groupid}/messages`;
        payload = { subject: formObj.subject, message: formObj.message };
      } else if (obj.textContent === 'reply') payload.parentMessageId = dummyData.selected.id;
      break;
  }
  server(endpoint, method, payload,
    (res) => {
      toggleLoader('.actionMail', '.res');
      try {
        const { id } = res.data[0];
        document.querySelector('.mail-resp').textContent = response;
      } catch (e) {
        document.querySelector('.mail-resp').textContent = res.error;
      }
    },
    (err) => {
      document.querySelector('.mail-resp').textContent = 'Something went wrong';
      toggleLoader('.actionMail', '.res');
    });
};
