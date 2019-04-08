/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const dummyData = {
  data: [],
  filtered: [],
  selected: [],
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

const closeModal = (obj) => {
  if (obj.classList.contains('modal') || obj.classList.contains('modal_close')) {
    document.querySelector('.newMailModal input[name=msgto]').checked = 'stranger';
    document.querySelector('.newMailModal .input-group').innerHTML = `<label for="email" class="email anim ">Receiver</label>
      <input required type="text" id="email" class="inputs" placeholder = "Email" name="email" />`;
    labelShow();
    switchClass('#newMailModal', 'target', 'remove');
    switchClass('#alertModal', 'target', 'remove');
  }
};

const generateTemplates = (page) => {
  document.querySelector('.content-wrapper').innerHTML = '';
  dummyData.filtered.forEach((msg, index) => {
    switch (page) {
      case 'groups':
        generateGroups(msg, index, dummyData.filtered);
        break;
      default:
        generateMails(msg, index, dummyData.filtered);
        break;
    }
  });
};
const msgReceiver = (evt) => {
  console.log(evt.currentTarget.value);
  switch (evt.currentTarget.value) {
    case 'stranger':
      document.querySelector('.newMailModal .input-group').innerHTML = `<label for="email" class="email anim ">Receiver</label>
      <input required type="text" id="email" class="inputs" placeholder = "Email" name="email" />`;
      if (document.querySelector('.actionMail.save').classList.contains('gone')) switchClass('.actionMail.save', 'gone');
      labelShow();
      break;
    case 'contact':
      server(
        'users/contacts', 'GET', {},
        (res) => {
          let str = '<select class="inputs email" name="email"><option value="" selected disabled>Select Contact</option>';
          console.log(res);
          res.data.forEach((elem) => {
            console.log(elem);
            str += `<option value="${elem.email}">${elem.firstname} ${elem.lastname}</option>`;
          });
          str += '</select>';
          document.querySelector('.newMailModal .input-group').innerHTML = str;
        },
        (err) => {
          console.log(err);
        },
      );
      if (document.querySelector('.actionMail.save').classList.contains('gone')) switchClass('.actionMail.save', 'gone');
      break;
    case 'group':
      server(
        'groups', 'GET', {},
        (res) => {
          let str = '<select class="inputs groupid" name=groupid><option value=0 selected disabled>Select Group</option>';
          console.log(res);
          res.data.forEach((elem) => {
            console.log(elem);
            str += `<option value="${elem.id}">${elem.name}</option>`;
          });
          str += '</select>';
          document.querySelector('.newMailModal .input-group').innerHTML = str;
          if (!document.querySelector('.actionMail.save').classList.contains('gone')) switchClass('.actionMail.save', 'gone');
        },
        (err) => {
          console.log(err);
        },
      );
      break;
    default:
  }
};
const deletePost = (id, post) => {
  server(
    endpoint, 'DELETE', {},
    (res) => {
      console.log(res);
      dummyData.data = res.data;
      dummyData.filtered = dummyData.data;
      generateTemplates(menu);
    },
    (err) => {
      console.log(err);
    },
  );
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
      dummyData.data = res.data;
      dummyData.filtered = dummyData.data;
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
      dummyData.data = res.data;
      dummyData.filtered = dummyData.data;
      generateTemplates(menu);
    },
    (err) => {
      console.log(err);
    },
  );
};
const modalActivate = () => {
  const modalopen = document.querySelectorAll('.modalopen');
  const alertopen = document.querySelectorAll('.alertopen');
  const response = document.querySelectorAll('.res');

  modalopen.forEach((modalopener) => {
    modalopener.addEventListener('click', (evt) => {
      const mailtype = evt.target.getAttribute('data-mail');
      console.log(mailtype);
      switchClass('#newMailModal', 'target', 'add');
      document.querySelector('#newMailModal').setAttribute('data-mail', mailtype);
      if (mailtype !== 'send') {
        document.querySelector('#newMailModal [name=email]').value = dummyData.selected.email;
        document.querySelector('#newMailModal [name=subject]').value = dummyData.selected.subject;
        document.querySelector('#newMailModal [name=message]').value = dummyData.selected.message;
      }
      response.forEach((resp) => {
        resp.textContent = '';
      });
    });
  });
  alertopen.forEach((alertopener) => {
    alertopener.addEventListener('click', (evt) => {
      const mailtype = evt.target.getAttribute('data-mail');
      const endpoint = `messages/${dummyData.selected.id}`;
      let method;
      console.log(mailtype);
      switchClass('#alertModal', 'target');
      toggleLoader('.okbtn', '.alertModal .res', '.alertModal .loader');
      if (mailtype === 'send') {
        method = 'POST';
      } else if (mailtype === 'delete') {
        method = 'DELETE';
      }
      setTimeout(() => {
        server(
          endpoint,
          method,
          {},
          (res) => {
            toggleLoader('.okbtn', '.alertModal .res', '.alertModal .loader');
            try {
              console.log(res.data[0]);
              const { message } = res.data[0];
              document.querySelector('#alertModal .mail-resp').textContent = mailtype === 'send' ? 'Draft Message sent sucessfully' : message;
            } catch (e) {
              document.querySelector('#alertModal .mail-resp').textContent = res.error;
            }
          },
          (err) => {
            console.log(err);
            document.querySelector('#alertModal .mail-resp').textContent = 'Something went wrong';
            toggleLoader('.okbtn', '.alertModal .res', '.alertModal .loader');
          },
        );
      }, 1000);
    });
  });
};

const actionMail = (evt) => {
  const formObj = formToJson(document.querySelector('.newMailModal .form-hd'));
  let endpoint;
  let payload;
  let response;
  let method;
  toggleLoader('.actionMail', '.res');
  setTimeout(() => {
    switch (evt.target.textContent) {
      case 'save':
        delete formObj.msgto;
        endpoint = 'messages/save';
        payload = formObj;
        response = 'messages saved successfully';
        method = 'POST';
        break;
      case 'send':
        if (formObj.msgto === 'group') {
          endpoint = `groups/${formObj.groupid}/messages`;
          payload = { subject: formObj.subject, message: formObj.message };
        } else {
          endpoint = 'messages';
          payload = { email: formObj.email, subject: formObj.subject, message: formObj.message };
        }
        response = 'messages sent successfully';
        method = 'POST';
        break;
      case 'reply':
        endpoint = 'messages';
        payload = {
          parentMessageId: dummyData.selected.id,
          email: formObj.email,
          subject: formObj.subject,
          message: formObj.message,
        };
        response = 'messages sent successfully';
        method = 'POST';
        break;
      case 'update':
        endpoint = `messages/${dummyData.selected.id}`;
        payload = { email: formObj.email, subject: formObj.subject, message: formObj.message };
        response = 'messages updated successfully';
        method = 'PATCH';
        break;
      default:
        break;
    }
    server(
      endpoint,
      method,
      payload,
      (res) => {
        toggleLoader('.actionMail', '.res');
        try {
          const { message, subject } = res.data[0];
          document.querySelector('.mail-resp').textContent = response;
        } catch (e) {
          document.querySelector('.mail-resp').textContent = res.error;
        }
      },
      (err) => {
        document.querySelector('.mail-resp').textContent = 'Something went wrong';
        toggleLoader('.actionMail', '.res');
      },
    );
  }, 1000);
};

(() => {
  switchEvents('.main .navicon', ['.main', 'open-nav', 'toggle']);
  switchEvents('.main-body', ['.main', 'open-nav', 'remove']);
  modalActivate();
  server(
    'messages', 'GET', {},
    (res) => {
      console.log(res);
      dummyData.data = res.data;
      dummyData.filtered = dummyData.data;
      generateTemplates('mails');
    },
    (err) => {
      console.log(err);
    },
  );
})();
