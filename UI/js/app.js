/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const dummyData = {
  data: [],
  filtered: [],
  selected: [],
};

const wipePage = (page, subpage = null) => {
  switchClass('.newgroupmember', 'selected', 'remove');
  switchClass('.navig h3.active', 'active');
  switchClass('.mail-types li.active', 'active');
  switchClass(`[data-nav="${page}"]`, 'active');
  if (subpage) switchClass(`[data-nav="${subpage}"]`, 'active');
  switchTab(page);
  document.querySelectorAll('.content-wrapper').forEach((elem) => { elem.innerHTML = ''; });
  document.querySelectorAll('.content-wrapper-bloated').forEach((elem) => { elem.innerHTML = ''; });
  document.querySelector('#tabname').textContent = page;
  document.querySelector('.main').setAttribute('data-tab', page);
};

const generateTemplates = (page, subpage) => {
  dummyData.filtered.forEach((msg, index) => {
    switch (page) {
      case 'groups':
        generateGroups(msg, index, dummyData.filtered.length);
        break;
      default:
        generateMails(msg, index);
        break;
    }
  });
};

const getPageData = (route, page, subpage) => {
  wipePage(page, subpage);
  server(
    route, 'GET', {},
    (res) => {
      console.log(res);
      dummyData.data = res.data;
      dummyData.filtered = dummyData.data;
      generateTemplates(page, subpage);
    },
    (err) => {
      console.log(err);
    },
  );
};

const navig = (obj) => {
  resetTab();
  const page = obj.getAttribute('data-nav');
  const route = obj.getAttribute('data-route');
  if (!route) wipePage(page);
  else getPageData(route, page);
};

const subNavig = (obj) => {
  resetTab();
  const subpage = obj.getAttribute('data-nav');
  const page = obj.getAttribute('data-parent-nav');
  const route = obj.getAttribute('data-route');
  if (route) getPageData(route, page, subpage);
};

const signOut = () => {
  localStorage.clear();
  window.location.href = './signIn.html';
};

const selectPost = (obj, target = null) => {
  if (target) {
    if (target.classList.contains('trash') || target.classList.contains('edit')) return false;
  }
  switchClass('.wrapper .main', 'selected', 'add');
  switchClass('.newgroupmember', 'selected', 'add');
  switchClass('.left-body .post', 'active', 'remove');
  switchClass('.left-body .post', 'opac-70', 'add');
  obj.classList.add('active');
  switchClass('.left-body .post.active', 'opac-70', 'remove');
  setTimeout(() => {
    switchClass('.tab.block .left-body.tab-content', 'display', 'add');
    switchClass('.tab.block .right-body.tab-content', 'display', 'remove');
  }, 500);
  return true;
};

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

const openCloseNav = () => {
  switchClass('.side-nav .mail-types', 'open');
  switchClass('.top-nav .mail-types', 'open');
  switchClass('.main', 'open-sub-nav');
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

const actionModal = (obj) => {
  console.log(obj);
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
  server(endpoint, method, payload,
    (res) => {
      toggleLoader('.actionMail, .actionGroup, .actionGroupMember', '.res');
      try {
        const { id } = res.data[0];
        console.log(res.data[0]);
        document.querySelectorAll('.mail-resp').forEach((elem) => { elem.textContent = response; });
      } catch (e) {
        document.querySelectorAll('.mail-resp').forEach((elem) => { elem.textContent = res.error; });
      }
    },
    (err) => {
      document.querySelectorAll('.mail-resp').forEach((elem) => { elem.textContent = 'Something went wrong'; });
      toggleLoader('.actionMail, .actionGroup, .actionGroupMember', '.res');
    });
};
(() => {
  switchEvents('.main .navicon', ['.main', 'open-nav', 'toggle']);
  switchEvents('.main-body', ['.main', 'open-nav', 'remove']);
  subNavig(document.querySelector('[data-nav="inbox"]'));
})();
