/* eslint-disable no-undef */
(() => {
  document.querySelector('.d-arrow').addEventListener('click', openCloseNav);
  document.querySelector('.top-nav .d-arrow').addEventListener('click', openCloseNav);
  document.querySelector('.backbtn').addEventListener('click', resetTab);
  document.querySelector('.create-group-btn').addEventListener('click', createGroup);
  document.querySelector('.addgroup').addEventListener('click', addContactToGroup);
  document.querySelectorAll('.navig h3').forEach((nav) => {
    nav.addEventListener('click', navig);
  });
  document.querySelectorAll('.custom-modal').forEach((elem) => {
    elem.addEventListener('click', closeModal);
  });
  document.querySelectorAll('[data-nav="signOut"]').forEach((elem) => {
    elem.addEventListener('click', signOut);
  });
  document.querySelectorAll('.mail-types li').forEach((nav) => {
    nav.addEventListener('click', subNavig);
  });
  document.querySelectorAll('.actionMail').forEach((btn) => {
    btn.addEventListener('click', actionMail);
  });
})();
