/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const dummyData = {
  data: [],
  filtered: [],
  selected: [],
};

const openCloseNav = () => {
  switchClass('.side-nav .mail-types', 'open');
  switchClass('.top-nav .mail-types', 'open');
  switchClass('.main', 'open-sub-nav');
};

const wipePage = (page, subpage = null) => {
  switchClass('.navig h3.active', 'active');
  switchClass('.mail-types li.active', 'active');
  switchClass(`[data-nav="${page}"]`, 'active');
  if (subpage) switchClass(`[data-nav="${subpage}"]`, 'active');
  switchTab(page);
  document.querySelector('.content-wrapper').innerHTML = '';
  document.querySelector('.content-wrapper-bloated').innerHTML = '';
  document.querySelector('#tabname').textContent = page;
  document.querySelector('.main').setAttribute('data-tab', page);
};

const generateTemplates = (page, subpage) => {
  wipePage(page, subpage);
  dummyData.filtered.forEach((msg, index) => {
    switch (page) {
      case 'groups':
        generateGroups(msg, index);
        break;
      default:
        generateMails(msg, index);
        break;
    }
  });
};

const getPageData = (route, page, subpage) => {
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

const selectPost = (evt) => {
  switchClass('.wrapper .main', 'selected', 'add');
  switchClass('.mails .post', 'active', 'remove');
  switchClass('.mails .post', 'opac-70', 'add');
  evt.currentTarget.classList.add('active');
  switchClass('.mails .post.active', 'opac-70', 'remove');
  setTimeout(() => {
    switchClass('.tab.block .left-body.tab-content', 'display', 'add');
    switchClass('.tab.block .right-body.tab-content', 'display', 'remove');
  }, 500);
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
};

const closeModal = (obj) => {
  if (obj.classList.contains('modal') || obj.classList.contains('modal_close')) {
    document.querySelector('.newMailModal input[name=msgto]').checked = 'stranger';
    document.querySelector('.newMailModal .input-group').innerHTML = strangerEmailField;
    labelShow();
    document.querySelectorAll('.inputs').forEach((resp) => {
      resp.value = '';
    });
    switchClass('#newMailModal', 'target', 'remove');
    switchClass('#alertModal', 'target', 'remove');
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
  } else if (actionType === 'warning') {
    alertServerCall('DELETE', `messages/${dummyData.selected.id}`);
    document.querySelector('#alertModal .res').textContent = warning;
  }
};

(() => {
  switchEvents('.main .navicon', ['.main', 'open-nav', 'toggle']);
  switchEvents('.main-body', ['.main', 'open-nav', 'remove']);
  subNavig(document.querySelector('[data-nav="inbox"]'));
})();
