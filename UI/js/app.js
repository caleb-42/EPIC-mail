/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const dummyData = {
  messages: [],
  filtered: [],
};

const createGroup = () => {
  document.querySelector('.group-resp').textContent = '';
  console.log(document.querySelector('.create-group .inputs').value);
  if (document.querySelector('.create-group .inputs').value === '') {
    document.querySelector('.group-resp').textContent = 'group name is empty';
    return;
  }
  document.querySelector('.group-resp').textContent = 'new group created';
};

const addContactToGroup = () => {
  document.querySelector('.add-user-resp').textContent = '';
  console.log(document.querySelector('#group').value);
  if (document.querySelector('#group').value === '') {
    document.querySelector('.add-user-resp').textContent = 'select a user';
    return;
  }
  document.querySelector('.add-user-resp').textContent = 'user added succesfully';
};

const signOut = () => {
  localStorage.clear();
  window.location.href = './signIn.html';
};

const closeModal = (evt) => {
  if (evt.target.classList.contains('modal'))window.location.href = './app.html#';
};

const generateTemplates = (page) => {
  document.querySelector('.content-wrapper').innerHTML = '';
  dummyData.filtered.forEach((msg, index) => {
    switch (page) {
      case 'contacts':
        generateContacts(msg, index);
        break;
      case 'groups':
        generateGroups(msg, index);
        break;
      default:
        generateMails(msg, index);
        break;
    }
  });
};

const navig = (evt) => {
  resetTab();
  const menu = evt.currentTarget.getAttribute('data-nav');
  switchClass('.navig h3.active', 'active');
  switchClass('.mail-types li.active', 'active');
  switchClass(`[data-nav="${menu}"]`, 'active');
  document.querySelector('#tabname').textContent = menu;
  document.querySelector('.content-wrapper-bloated').innerHTML = '';
  document.querySelector('.content-wrapper').innerHTML = '';
  document.querySelector('.main').setAttribute('data-tab', menu);
  switchTab(menu);
  let endpoint;
  switch (menu) {
    case 'mails':
      endpoint = 'messages/all';
      break;
    case 'contacts':
      endpoint = 'users/contacts';
      break;
    case 'groups':
      endpoint = 'groups';
      break;
    default:
      endpoint = '';
      return;
  }
  server(
    endpoint, 'GET', {},
    (res) => {
      console.log(res);
      dummyData.messages = res.data;
      dummyData.filtered = dummyData.messages;
      generateTemplates(menu);
    },
    (err) => {
      console.log(err);
    },
  );
};

const subNavig = (evt) => {
  resetTab();
  switchClass('.wrapper .main', 'selected', 'remove');
  const menu = evt.currentTarget.getAttribute('data-nav');
  const parentMenu = evt.currentTarget.getAttribute('data-parent-nav');
  const route = evt.currentTarget.getAttribute('data-route');
  switchClass('.navig h3.active', 'active');
  switchClass(`[data-nav = "${parentMenu}"]`, 'active');
  switchClass('.mail-types li.active', 'active');
  switchClass(`[data-nav="${menu}"]`, 'active');
  document.querySelector('.content-wrapper-bloated').innerHTML = '';
  document.querySelector('.main').setAttribute('data-tab', parentMenu);
  document.querySelector('.content-wrapper').innerHTML = '';
  switchTab(parentMenu);
  document.querySelector('#tabname').textContent = menu;
  server(
    route, 'GET', {},
    (res) => {
      console.log(res);
      dummyData.messages = res.data;
      dummyData.filtered = dummyData.messages;
      generateTemplates(menu);
    },
    (err) => {
      console.log(err);
    },
  );
};

const actionMail = (evt) => {
  switchClass('actionbtn', 'vanish');
  setTimeout(() => {
    switch (evt.target.textContent) {
      case 'save':
        document.querySelector('.mail-resp').innerHTML = 'successfully saved';
        break;
      case 'send':
        document.querySelector('.mail-resp').innerHTML = 'successfully sent';
        break;
      case 'cancel':
        document.querySelector('.modal_close').click();
        break;
      default:

        break;
    }

    switchClass('actionbtn', 'vanish');
  });
};

(() => {
  switchEvents('.main .navicon', ['.main', 'open-nav', 'toggle']);
  switchEvents('.main-body', ['.main', 'open-nav', 'remove']);
  const modalopen = document.querySelectorAll('.modalopen');
  const response = document.querySelectorAll('.res');

  modalopen.forEach((a) => {
    a.addEventListener('click', () => {
      response.forEach((resp) => {
        resp.textContent = '';
      });
    });
  });

  server(
    'messages', 'GET', {},
    (res) => {
      console.log(res);
      dummyData.messages = res.data;
      dummyData.filtered = dummyData.messages;
      generateTemplates('mails');
    },
    (err) => {
      console.log(err);
    },
  );
})();
