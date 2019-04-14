/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const reconnect = (cback) => {
  document.querySelectorAll('.tryagain').forEach((elem) => {
    elem.addEventListener('click', (evt) => {
      cback();
    });
  });
};
modalActivate = () => {
  document.querySelectorAll('.modalopen').forEach((modalopener) => {
    modalopener.addEventListener('click', (evt) => {
      activateModals(evt.target);
      document.querySelectorAll('.res').forEach((resp) => {
        resp.textContent = '';
      });
    });
  });
  document.querySelectorAll('.alertopen').forEach((alertopener) => {
    alertopener.addEventListener('click', (evt) => {
      activateAlerts(evt.target);
      console.log(alertopener);
    });
  });
  document.querySelectorAll('.custom-modal, .modal_close').forEach((elem) => {
    elem.addEventListener('click', (evt) => { closeModal(evt.target); });
  });
};

(() => {
  document.querySelector('.uploader').addEventListener('click', () => {
    document.querySelector('.uploaddp').click();
    switchClass('.dp-image .dpname', 'gone', 'add');
    switchClass('.dp-image .loader', 'gone', 'remove');
    setTimeout(() => {
      switchClass('.dp-image .dpname', 'gone', 'remove');
      switchClass('.dp-image .loader', 'gone', 'add');
    }, 2500);
  });
  document.querySelector('.d-arrow').addEventListener('click', openCloseNav);
  document.querySelector('.top-nav .d-arrow').addEventListener('click', openCloseNav);
  document.querySelector('.backbtn').addEventListener('click', resetTab);
  document.querySelectorAll('.navig h3').forEach((nav) => {
    nav.addEventListener('click', (evt) => {
      navig(evt.currentTarget);
    });
  });
  document.querySelectorAll('.contactOptions input').forEach((elem) => {
    elem.addEventListener('change', (evt) => { contactOptions(evt.currentTarget); });
  });
  document.querySelectorAll('[data-nav="signOut"]').forEach((elem) => {
    elem.addEventListener('click', signOut);
  });
  document.querySelectorAll('.mail-types li').forEach((nav) => {
    nav.addEventListener('click', (evt) => {
      subNavig(evt.currentTarget);
    });
  });
  document.querySelectorAll('.actionMail, .actionGroup, .actionGroupMember').forEach((btn) => {
    btn.addEventListener('click', (evt) => {
      actionModal(evt.target);
    });
  });
  modalActivate();
})();
