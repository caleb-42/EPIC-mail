/* eslint-disable no-unused-vars */
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
const inputs = document.querySelectorAll('.input-group .inputs');
inputs.forEach((input) => {
  input.addEventListener('focusin', (event) => {
    event.target.parentNode.querySelector('label').classList.add('show');
  });
  input.addEventListener('focusout', (event) => {
    event.target.parentNode.querySelector('label').classList.remove('show');
  });
});
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  if (match) return match[2];
};
const server = async (
  url = '',
  method = '',
  body = {},
  resolve = (res) => {},
  reject = (err) => {}) => {
  body = JSON.stringify(body);
  console.log(document.cookie);
  const payload = method !== 'GET' ? {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body,
  } : {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  /* const endpoint = `https://epic-mail-application.herokuapp.com/api/v1/${url}`; */
  const endpoint = `http://localhost:3000/api/v1/${url}`;
  await fetch(endpoint, payload)
    .then(resp => resp.json())
    .then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
};

const loader = document.querySelector('.loader');
const resp = document.querySelector('.resp');
const toggleLoader = () => {
  if (loader.classList.contains('gone')) {
    resp.textContent = '';
    loader.classList.remove('gone');
    resp.classList.add('gone');
    document.querySelector('.submit').disabled = true;
  } else {
    loader.classList.add('gone');
    resp.classList.remove('gone');
    document.querySelector('.submit').disabled = false;
  }
};
