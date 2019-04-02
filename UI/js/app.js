/* eslint-disable no-undef */
(() => {
  dummyData.filtered = dummyData.messages.filter(msg => msg.status === 'read' || msg.status === 'unread');
  /* let endpoint = 'http://localhost:3000/api/v1/messages'; */

  document.querySelector('.d-arrow').addEventListener('click', openCloseNav);
  document.querySelector('.top-nav .d-arrow').addEventListener('click', openCloseNav);

  switchEvents('.main .navicon', ['.main', 'open-nav', 'toggle']);
  switchEvents('.main-body', ['.main', 'open-nav', 'remove']);

  document.querySelector('.backbtn').addEventListener('click', () => {
    resetTab();
  });
  document.querySelectorAll('.custom-modal').forEach((elem) => {
    elem.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('modal'))window.location.href = './app.html#';
    });
  });
  document.querySelector('.create-group-btn')
    .addEventListener('click', () => {
      document.querySelector('.group-resp').textContent = '';
      console.log(document.querySelector('.create-group .inputs').value);
      if (document.querySelector('.create-group .inputs').value === '') {
        document.querySelector('.group-resp').textContent = 'group name is empty';
        return;
      }
      document.querySelector('.group-resp').textContent = 'new group created';
    });

  const signOut = document.querySelectorAll('[data-nav="signOut"]');
  signOut.forEach((elem) => {
    elem.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = './signIn.html';
    });
  });
  document.querySelector('.addgroup')
    .addEventListener('click', () => {
      document.querySelector('.add-user-resp').textContent = '';
      console.log(document.querySelector('#group').value);
      if (document.querySelector('#group').value === '') {
        document.querySelector('.add-user-resp').textContent = 'select a user';
        return;
      }
      document.querySelector('.add-user-resp').textContent = 'user added succesfully';
    });

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

  const runDummy = () => {
    document.querySelector('.content-wrapper').innerHTML = '';
    dummyData.filtered.forEach((msg, index) => {
      const strHtml = `
              <div id = 'post-${index}' class="post pointer anim" data-id = "${msg.messageId}">
  
                  <div class="dp"></div>
                  <div class="details">
                      <h4>${msg.mailerName}</h4>
                      <p class="subject">${msg.subject}</p>
                      <div><span class="type">${msg.status}</span><span class="date">${msg.createdOn}</span></div>
                  </div>
                  <div class="clr"></div>
              </div>
              `;
      document.querySelector('.content-wrapper').insertAdjacentHTML('beforeend', strHtml);
      document.querySelector(`#post-${index}`).addEventListener('click', async (evt) => {
        selectPost(evt);
        /* const id = evt.currentTarget.getAttribute('data-id'); */
        const message = msg;
        document.querySelector('.content-wrapper-bloated').innerHTML = `
        <div class="post-bloated">
            <h3>${message.mailerName}</h3>
            <p class="subject">${message.subject}</p>
            <p class="msg">${message.message}</p>
            <p class="date">${message.createdOn}</p>
        </div>
        `;
        /* endpoint = `http://localhost:3000/api/v1/messages/${id}`;
        await server(endpoint, 'GET', (res) => {
          const message = res.data[0];
          document.querySelector('.content-wrapper-bloated').innerHTML = `
                <div class="post-bloated">
                    <h3>${message.mailerName}</h3>
                    <p class="subject">${message.subject}</p>
                    <p class="msg">${message.message}</p>
                    <p class="date">${message.createdOn}</p>
                </div>
                `;
        }); */
      });
    });
  };
  const navig = document.querySelectorAll('.navig h3');

  navig.forEach((nav) => {
    nav.addEventListener('click', (evt) => {
      resetTab();
      const menu = evt.currentTarget.getAttribute('data-nav');
      switchClass('.navig h3.active', 'active');
      switchClass('.mail-types li.active', 'active');
      switchClass(`[data-nav="${menu}"]`, 'active');
      document.querySelector('#tabname').textContent = menu;
      document.querySelector('.content-wrapper-bloated').innerHTML = '';
      dummyData.filtered = dummyData.messages;
      runDummy();
      /* testing locally */
      /* if (menu === 'mails') endpoint = 'http://localhost:3000/api/v1/messages/all';
      server(endpoint, 'GET', (res) => {
        dummyData.messages = res.data;
        runDummy();
      }); */
      switchTab(menu);
    });
  });

  const subNavig = document.querySelectorAll('.mail-types li');
  subNavig.forEach((nav) => {
    nav.addEventListener('click', (evt) => {
      resetTab();
      switchClass('.wrapper .main', 'selected', 'remove');
      const menu = evt.currentTarget.getAttribute('data-nav');
      const parentMenu = evt.currentTarget.getAttribute('data-parent-nav');
      switchClass('.navig h3.active', 'active');
      switchClass(`[data-nav = "${parentMenu}"]`, 'active');
      switchClass('.mail-types li.active', 'active');
      switchClass(`[data-nav="${menu}"]`, 'active');
      switchTab(parentMenu);
      document.querySelector('#tabname').textContent = menu;
      dummyData.filtered = dummyData.messages.filter((msg) => {
        if (menu === 'inbox') return msg.status === 'read' || msg.status === 'unread';
        return msg.status === menu;
      });
      document.querySelector('.content-wrapper-bloated').innerHTML = '';
      runDummy();
      /* testing locally */
      /* endpoint = (menu === 'inbox') ? 'http://localhost:3000/api/v1/messages' : `http://localhost:3000/api/v1/messages/${menu}`;
      server(endpoint, 'GET', (res) => {
        dummyData.messages = res.data;
        runDummy();
      }); */
    });
  });
  const inputs = document.querySelectorAll('.input-group .inputs');

  inputs.forEach((input) => {
    input.addEventListener('focusin', (event) => {
      event.target.parentNode.querySelector('label').classList.add('show');
    });
    input.addEventListener('focusout', (event) => {
      event.target.parentNode.querySelector('label').classList.remove('show');
    });
  });
  const actionMail = document.querySelectorAll('.actionMail');

  actionMail.forEach((btn) => {
    btn.addEventListener('click', (evt) => {
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
    });
  });
  const modalopen = document.querySelectorAll('.modalopen');
  const response = document.querySelectorAll('.res');

  modalopen.forEach((a) => {
    a.addEventListener('click', () => {
      response.forEach((resp) => {
        resp.textContent = '';
      });
    });
  });

  /* testing locally */
  /* server(endpoint, 'GET', (res) => {
    dummyData.messages = res.data;
    runDummy();
  }); */
  runDummy();
})();
