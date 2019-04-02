/* eslint-disable no-unused-vars */
const authenticate = () => {
  /* const email = localStorage.getItem('email');
    const password = localStorage.getItem('password'); */
  const signin = localStorage.getItem('email');
  if (!signin) window.location.href = './signUp.html';
};
authenticate();
const switchClass = (target, toggleClass, type = 'toggle') => {
  try {
    const navs = document.querySelectorAll(`${target}`);
    navs.forEach((nav) => {
      if (type === 'toggle')nav.classList.toggle(toggleClass);
      if (type === 'add')nav.classList.add(toggleClass);
      if (type === 'remove')nav.classList.remove(toggleClass);
    });
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};
const openCloseNav = () => {
  switchClass('.side-nav .d-arrow', 'down');
  switchClass('.side-nav .mail-types', 'open');
  switchClass('.top-nav .mail-types', 'open');
  switchClass('.main', 'open-sub-nav');
};
const switchTab = (nav, changeTab = true) => {
  if (changeTab) {
    switchClass('.tab.block', 'gone', 'add');
    switchClass('.tab.block.gone', 'block', 'remove');
    switchClass(`.${nav}.gone`, 'block', 'add');
    switchClass(`.${nav}.gone.block`, 'gone', 'remove');
  }
  /* fetchData(nav); */
};
const switchEvents = (target, arg) => {
  document.querySelector(target)
    .addEventListener('click', () => {
      switchClass(arg[0], arg[1], arg[2]);
    });
};
const resetTab = () => {
  switchClass('.wrapper .main', 'selected', 'remove');
  setTimeout(() => {
    switchClass('.tab.block .left-body.tab-content', 'display', 'remove');
    switchClass('.tab.block .right-body.tab-content', 'display', 'add');
  }, 500);
};
const server = async (url = '', method = '', resolve = () => {}, headers = {
  'Content-Type': 'application/json',
  'x-auth-token': localStorage.getItem('token'),
}, reject = () => {}) => {
  await fetch(url, {
    method,
    headers,
  })
    .then(resp => resp.json())
    .then((res) => {
      resolve(res);
    }).catch(() => {
      reject();
    });
};
