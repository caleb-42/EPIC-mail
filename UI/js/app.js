/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const fillPage = (html, page = 'recreate') => {
  page = `.${page}`;
  document.querySelectorAll(`${page} .content-wrapper`).forEach((elem) => { elem.innerHTML = html; });
};

const wipePage = (page, subpage = null, loadPage = true, wipeRightMenu = true) => {
  switchClass('.navig h3.active', 'active');
  switchClass('.mail-types li.active', 'active');
  switchClass(`[data-nav="${page}"]`, 'active');
  if (subpage) switchClass(`[data-nav="${subpage}"]`, 'active');
  switchTab(page);
  if (loadPage) fillPage(loading, page);
  if (wipeRightMenu) {
    document.querySelectorAll('.content-wrapper-bloated').forEach((elem) => { elem.innerHTML = ''; });
  }
  document.querySelector('#tabname').textContent = page;
  document.querySelector('.main').setAttribute('data-tab', page);
};

const generateTemplates = (page, subpage) => {
  /* console.log(page); */
  if (dummyData.data.length === 0) fillPage(htmlServerResponse(), page);
  else fillPage('');
  dummyData.data.forEach((dummy, index) => {
    switch (page) {
      case 'groups':
        generateGroups(dummy, index, dummyData.data.length);
        break;
      default:
        generateMails(dummy, index);
        break;
    }
  });
};

const getPageData = (route, page, subpage, wipeRightMenu) => {
  if (!route) { /* if no route specified do not fetch data */
    wipePage(page, subpage, false);
    dummyData.data = [];
    dummyData.selected = [];
    return;
  }
  wipePage(page, subpage, true, wipeRightMenu);
  server(route, 'GET', {},
    (res) => {
      /* console.log(res); */
      if (res.error) fillPage(htmlServerResponse('Unauthorized Access'));
      dummyData.data = res.data;
      generateTemplates(page, subpage);
    },
    (err) => {
      fillPage(failedResponse);
      reconnect(() => {
        getPageData(route, page, subpage, wipeRightMenu);
      });
      console.log(err);
    });
};

const navig = (obj, wipeRightMenu = true) => {
  if (wipeRightMenu) resetTab();
  const page = obj.getAttribute('data-nav');
  const route = obj.getAttribute('data-route');
  getPageData(route, page, null, wipeRightMenu);
  /* reset selected post on new nav */
  if (dummyData.menu.name !== page) dummyData.selected = [];
  dummyData.menu = { type: 'menu', name: page };
};

const subNavig = (obj, wipeRightMenu = true) => {
  if (wipeRightMenu) resetTab();
  const subpage = obj.getAttribute('data-nav');
  const page = obj.getAttribute('data-parent-nav');
  const route = obj.getAttribute('data-route');
  getPageData(route, page, subpage, wipeRightMenu);
  /* reset selected post on new nav */
  if (dummyData.menu.name !== subpage) dummyData.selected = [];
  dummyData.menu = { type: 'submenu', name: subpage };
};

const resetPage = (wipeRightMenu) => {
  const menu = document.querySelector(`[data-nav=${dummyData.menu.name}]`);
  const nav = dummyData.menu.type === 'menu' ? navig(menu, wipeRightMenu) : subNavig(menu, wipeRightMenu);
};

const signOut = () => {
  localStorage.clear();
  window.location.href = './signIn.html';
};

const selectPost = (obj, target = null) => {
  /* dont select group post incase edit or delete icon is clicked */
  try {
    if (target.classList.contains('trash') || target.classList.contains('edit')) return false;
  } catch (e) { console.log(e); }
  switchClass('.wrapper .main', 'selected', 'add');
  switchClass('.newgroupmember', 'selected', 'add');
  switchClass('.left-body .post', 'active', 'remove');
  switchClass('.left-body .post', 'opac-70', 'add');
  /* make post active */
  obj.classList.add('active');
  /* slide through left and right body in mobile devices */
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
let imageData;
const displayImage = (input) => {
  switchClass('.dp-image .dpname', 'gone', 'add');
  switchClass('.dp-image .loader', 'gone', 'remove');
  let fileName = input.value;
  fileName = fileName.split(/(\\|\/)/g).pop();
  document.querySelector('.dpname').innerHTML = fileName;
  if (input.files && input.files[0]) {
    [imageData] = input.files;
    /* console.log(input.files); */
    const reader = new FileReader();
    reader.onload = (e) => {
      switchClass('.dp-image .dpname', 'gone', 'remove');
      switchClass('.dp-image .loader', 'gone', 'add');
      document.querySelector('.userdp').setAttribute('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
};
/*  */
const saveImage = () => {
  if (!imageData) return;
  switchClass('.dp-image .dpname', 'gone', 'add');
  switchClass('.dp-image .loader', 'gone', 'remove');
  const uploaddp = document.querySelector('form.dpForm');
  const fdata = new FormData();
  fdata.append('userDp', imageData, imageData.name);
  /* fetch('http://localhost:3000/api/v1/users/save', */
  fetch('https://epic-mail-application.herokuapp.com/api/v1/users/save',
    {
      method: 'PATCH',
      body: fdata,
      credentials: 'include',
    }).then(resp => resp.json())
    .then((res) => {
      switchClass('.dp-image .dpname', 'gone', 'remove');
      switchClass('.dp-image .loader', 'gone', 'add');
      /* console.log(res); */
      const { dp } = res.data[0];
      document.querySelector('.userdp').setAttribute('src', dp);
    }).catch((err) => {
      switchClass('.dp-image .dpname', 'gone', 'remove');
      switchClass('.dp-image .loader', 'gone', 'add');
      console.log(err);
    });
};

const contactOptions = (obj) => {
  const modalClass = obj.getAttribute('modal-class');
  const modalInput = document.querySelector(`.${modalClass} .input-group`);
  switch (obj.value) {
    case 'stranger':
      modalInput.innerHTML = strangerEmailField;
      switchClass('.actionMail.save', 'gone', 'remove');
      labelShow();
      break;
    case 'contact':
      server(
        'users/contacts', 'GET', {},
        (res) => {
          modalInput.innerHTML = contactEmailField(res.data);
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
          modalInput.innerHTML = groupIdField(res.data);
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
  document.querySelector('.userdp').setAttribute('src', localStorage.getItem('dp'));
  document.querySelector('.userEmail').textContent = localStorage.getItem('email');
  document.querySelector('.userPhone').textContent = localStorage.getItem('phoneNumber');
  /* document.querySelector('.userRecoveryEmail').textContent = localStorage.getItem('recoveryEmail'); */
})();
