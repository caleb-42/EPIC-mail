/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const fillPage = (html, page = 'recreate') => {
  page = `.${page}`;
  document.querySelectorAll(`${page} .content-wrapper`).forEach((elem) => { elem.innerHTML = html; });
};

const wipePage = (page, subpage = null, loadPage = true, wipeRightMenu = true) => {
  switchClass('.newgroupmember', 'selected', 'remove');
  switchClass('.navig h3.active', 'active');
  switchClass('.mail-types li.active', 'active');
  switchClass(`[data-nav="${page}"]`, 'active');
  if (subpage) switchClass(`[data-nav="${subpage}"]`, 'active');
  switchTab(page);
  if (loadPage) fillPage(loading, page);
  if (wipeRightMenu) document.querySelectorAll('.content-wrapper-bloated').forEach((elem) => { elem.innerHTML = ''; });
  document.querySelector('#tabname').textContent = page;
  document.querySelector('.main').setAttribute('data-tab', page);
};

const generateTemplates = (page, subpage) => {
  console.log(page);
  if (dummyData.filtered.length === 0 && page !== 'settings') {
    fillPage(htmlServerResponse(), page);
    return;
  } if (page !== 'settings') fillPage('');
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
  if (!route) {
    wipePage(page, subpage, false);
    generateTemplates(page, subpage);
    dummyData.filtered = [];
    dummyData.route = '';
    return;
  }
  dummyData.route = route;
  server(
    route, 'GET', {},
    (res) => {
      console.log(res);
      if (res.error) fillPage(htmlServerResponse('Unauthorized Access'));
      dummyData.data = res.data;
      dummyData.filtered = dummyData.data;
      generateTemplates(page, subpage);
    },
    (err) => {
      fillPage(failedResponse);
      reconnect(() => {
        getPageData(route, page, subpage);
      });
      console.log(err);
    },
  );
};

const navig = (obj, leaveSubMenu = true) => {
  if (leaveSubMenu) resetTab();
  const page = obj.getAttribute('data-nav');
  const route = obj.getAttribute('data-route');
  getPageData(route, page);
  if (dummyData.menu.name !== page) dummyData.selected = [];
  dummyData.menu.type = 'menu';
  dummyData.menu.name = page;
  if (route) wipePage(page, null, true, leaveSubMenu);
};

const subNavig = (obj, leaveSubMenu = true) => {
  if (leaveSubMenu) resetTab();
  const subpage = obj.getAttribute('data-nav');
  const page = obj.getAttribute('data-parent-nav');
  const route = obj.getAttribute('data-route');
  getPageData(route, page, subpage);
  if (dummyData.menu.name !== subpage) dummyData.selected = [];
  dummyData.menu.type = 'submenu';
  dummyData.menu.name = subpage;
  if (route) wipePage(page, subpage, true, leaveSubMenu);
};

const resetPage = (leaveSubMenu) => {
  if (dummyData.menu.type === 'menu') navig(document.querySelector(`[data-nav=${dummyData.menu.name}]`), leaveSubMenu);
  else if (dummyData.menu.type === 'submenu') subNavig(document.querySelector(`[data-nav=${dummyData.menu.name}]`), leaveSubMenu);
};

const signOut = () => {
  localStorage.clear();
  window.location.href = './signIn.html';
};

const selectPost = (obj, target = null) => {
  if (target) {
    console.log(target.classList.contains('trash') || target.classList.contains('edit'));
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

const openCloseNav = () => {
  switchClass('.side-nav .mail-types', 'open');
  switchClass('.top-nav .mail-types', 'open');
  switchClass('.main', 'open-sub-nav');
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

(() => {
  switchEvents('.main .navicon', ['.main', 'open-nav', 'toggle']);
  switchEvents('.main-body', ['.main', 'open-nav', 'remove']);
  subNavig(document.querySelector('[data-nav="inbox"]'));
})();
