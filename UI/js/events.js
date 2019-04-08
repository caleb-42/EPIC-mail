/* eslint-disable no-undef */
(() => {
  document.querySelector('.d-arrow').addEventListener('click', openCloseNav);
  document.querySelector('.top-nav .d-arrow').addEventListener('click', openCloseNav);
  document.querySelector('.backbtn').addEventListener('click', resetTab);
  document.querySelector('.create-group-btn').addEventListener('click', createGroup);
  document.querySelectorAll('.navig h3').forEach((nav) => {
    nav.addEventListener('click', navig);
  });
  document.querySelectorAll('.custom-modal, .modal_close').forEach((elem) => {
    elem.addEventListener('click', (evt) => { closeModal(evt.target); });
  });
  document.querySelectorAll('.msgToCon input').forEach((elem) => {
    elem.addEventListener('change', msgReceiver);
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
