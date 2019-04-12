/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const activateModals = (obj) => {
  const actionType = obj.getAttribute('data-action');
  const modal = obj.getAttribute('data-modal');
  console.log(actionType);
  switchClass(modal, 'target', 'add');
  document.querySelector(modal).setAttribute('data-action', actionType);
  if (actionType !== 'send' && modal === '#newMailModal') {
    document.querySelector(`${modal} [name=email]`).value = dummyData.selected.email;
    document.querySelector(`${modal} [name=subject]`).value = dummyData.selected.subject;
    document.querySelector(`${modal} [name=message]`).value = dummyData.selected.message;
  }
  if (actionType === 'editgroup' && modal === '#newGroupModal') {
    dummyData.selected = dummyData.data.find(elem => Number(elem.id) === Number(obj.getAttribute('data-post-id')));
    document.querySelector(`${modal} [name=name]`).value = dummyData.selected.name;
  }
};

const closeModal = (obj) => {
  if (obj.classList.contains('modal') || obj.classList.contains('modal_close')) {
    document.querySelector('.newMailModal input[name=msgto]').checked = 'stranger';
    document.querySelector('.newMailModal .input-group').innerHTML = strangerEmailField;
    labelShow();
    document.querySelectorAll('.inputs').forEach((resp) => {
      resp.value = '';
    });
    switchClass('.modal', 'target', 'remove');
  }
};

const alertServerCall = (method, endpoint, respMsg = null) => {
  toggleLoader('.okbtn', '.alertModal .res', '.alertModal .loader');
  server(
    endpoint,
    method,
    {},
    (res) => {
      toggleLoader('.okbtn', '.alertModal .res', '.alertModal .loader');
      try {
        dummyData.selected = [];
        resetPage(true);
        const { message } = res.data[0];
        document.querySelector('#alertModal .res').textContent = respMsg || message;
      } catch (e) {
        document.querySelector('#alertModal .res').textContent = res.error;
      }
    },
    (err) => {
      console.log(err);
      document.querySelector('#alertModal .res').textContent = 'Something went wrong';
      toggleLoader('.okbtn', '.alertModal .res', '.alertModal .loader');
    },
  );
};

const activateAlerts = (obj, warning) => {
  const actionType = obj.getAttribute('data-action');
  switchClass('#alertModal', 'target');
  if (actionType === 'send') {
    alertServerCall('POST', `messages/${dummyData.selected.id}`, 'Draft Message sent sucessfully');
  } else if (actionType === 'delete') {
    alertServerCall('DELETE', `messages/${dummyData.selected.id}`);
  } else if (actionType === 'deletegroup') {
    console.log(actionType);
    alertServerCall('DELETE', `groups/${obj.getAttribute('data-post-id')}`);
  } else if (actionType === 'deletegroupmember') {
    console.log(actionType);
    alertServerCall('DELETE', `groups/${obj.getAttribute('data-group-id')}/users/${obj.getAttribute('data-post-id')}`);
  } else if (actionType === 'warning') {
    alertServerCall('DELETE', `messages/${dummyData.selected.id}`);
    document.querySelector('#alertModal .res').textContent = warning;
  }
};

const refreshRightMenu = (data, action) => {
  if (dummyData.menu.name === 'groups' && action !== 'create group') loadBloatedGroups(data, 0);
  else if (dummyData.menu.name === 'groups' && action === 'create group') {
    // eslint-disable-next-line no-use-before-define
    actionModalServer(`groups/${dummyData.selected.id}/users`, 'GET', {}, '', 'add user');
  } else if (dummyData.menu.name !== 'groups' && dummyData.menu.name !== 'settings') loadBloatedMails(data[0]);
  modalActivate();
};

const actionModalServer = (endpoint, method, payload, response, action) => {
  server(endpoint, method, payload,
    (res) => {
      toggleLoader('.actionMail, .actionGroup, .actionGroupMember', '.res');
      try {
        const { id } = res.data[0];
        if (dummyData.selected.length !== 0) refreshRightMenu(res.data, action);
        if (response !== '') {
          resetPage(false);
          document.querySelectorAll('.mail-resp').forEach((elem) => { elem.textContent = response; });
        }
      } catch (e) {
        if (response !== '') document.querySelectorAll('.mail-resp').forEach((elem) => { elem.textContent = res.error; });
      }
    },
    (err) => {
      if (response !== '') document.querySelectorAll('.mail-resp').forEach((elem) => { elem.textContent = 'Something went wrong'; });
      toggleLoader('.actionMail, .actionGroup, .actionGroupMember', '.res');
    });
};

const actionModal = (obj) => {
  let formObj = {};
  document.querySelectorAll('.newMailModal .form-hd, .newGroupModal .form-hd, .newGroupMemberModal .form-hd').forEach((elem) => { formObj = Object.assign({}, formToJson(elem), formObj); });
  let endpoint = 'messages';
  const { email, subject, message } = formObj;
  let payload = { email, subject, message };
  let response = 'messages sent successfully';
  let method = 'POST';
  toggleLoader('.actionMail, .actionGroup, .actionGroupMember', '.res');
  switch (obj.textContent) {
    case 'save':
      delete formObj.msgto;
      endpoint = 'messages/save';
      payload = { email: formObj.email, subject: formObj.subject, message: formObj.message };
      response = 'messages saved successfully';
      method = 'POST';
      break;
    case 'update':
      endpoint = `messages/${dummyData.selected.id}`;
      payload = { email: formObj.email, subject: formObj.subject, message: formObj.message };
      response = 'messages updated successfully';
      method = 'PATCH';
      break;
    case 'create group':
      endpoint = 'groups';
      payload = { name: formObj.name };
      response = 'group created successfully';
      method = 'POST';
      break;
    case 'edit group':
      endpoint = `groups/${dummyData.selected.id}/name`;
      payload = { name: formObj.newname };
      response = 'group name changed successfully';
      method = 'PATCH';
      break;
    case 'add user':
      endpoint = `groups/${dummyData.selected.id}/users`;
      console.log(formObj);
      payload = { email: formObj.memberemail };
      response = 'user added successfully';
      method = 'POST';
      break;
    default:
      if (obj.textContent === 'send' && formObj.msgto === 'group') {
        console.log(formObj);
        endpoint = `groups/${formObj.groupid}/messages`;
        payload = { subject: formObj.subject, message: formObj.message };
      } else if (obj.textContent === 'reply') payload.parentMessageId = dummyData.selected.id;
      break;
  }
  actionModalServer(endpoint, method, payload, response, obj.textContent);
};
