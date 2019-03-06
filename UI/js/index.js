(() => {
  const authenticate = () => {
    /* const email = localStorage.getItem('email');
    const password = localStorage.getItem('password'); */
    /* const signin = localStorage.getItem('signin');
    if (!signin) window.location.href = './signUp.html'; */
  };
  const dummyData = { messages: [], filtered: [] };
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
  document.querySelector('.side-nav .d-arrow').addEventListener('click', () => {
    openCloseNav();
  });
  document.querySelector('.backbtn').addEventListener('click', () => {
    switchClass('.wrapper .main .tab', 'selected', 'remove');
  });
  document.querySelector('.top-nav .d-arrow').addEventListener('click', () => {
    openCloseNav();
  });
  document.querySelector('.main .navicon')
    .addEventListener('click', () => {
      switchClass('.main', 'open-nav');
    });
  document.querySelector('.main-body')
    .addEventListener('click', () => {
      switchClass('.main', 'open-nav', 'remove');
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

  document.querySelector('.signout')
    .addEventListener('click', () => {
      localStorage.clear();
      window.location.href = './signIn.html';
    });
  document.querySelector('.main-body')
    .addEventListener('click', () => {
      switchClass('.main', 'open-nav', 'remove');
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

  const runDummy = () => {
    let strHtml = '';
    let counter = 0;
    dummyData.filtered.forEach((msg) => {
      strHtml += `
              <div class="post anim" data-index = "${counter}">
  
                  <div class="dp"></div>
                  <div class="details">
                      <h4>${msg.status !== 'sent' || msg.status !== 'draft' ? msg.senderName : msg.recieverName}</h4>
                      <p class="subject">${msg.subject}</p>
                      <div><span class="type">${msg.status}</span><span class="date">${msg.createdOn}</span></div>
                  </div>
                  <div class="clr"></div>
              </div>
              `;
      counter += 1;
    });
    document.querySelector('.content-wrapper').innerHTML = strHtml;
    const posts = document.querySelectorAll('.post');
    posts.forEach((post) => {
      post.addEventListener('click', (evt) => {
        switchClass('.wrapper .main .tab', 'selected', 'toggle');
        switchClass('.mails .post', 'active', 'remove');
        switchClass('.mails .post', 'opac-70', 'add');
        evt.currentTarget.classList.add('active');
        switchClass('.mails .post.active', 'opac-70', 'remove');
        const index = evt.currentTarget.getAttribute('data-index');
        const msg = dummyData.filtered[index];
        console.log(index, msg, evt.target);
        document.querySelector('.content-wrapper-bloated').innerHTML = `
                <div class="post-bloated">
                    <h3>${msg.status !== 'sent' || msg.status !== 'draft' ? msg.senderName : msg.recieverName}</h3>
                    <p class="subject">${msg.subject}</p>
                    <p class="msg">${msg.message}</p>
                    <p class="date">${msg.createdOn}</p>
                </div>
                `;
      });
    });
  };
  const navig = document.querySelectorAll('.navig h3');

  navig.forEach((nav) => {
    nav.addEventListener('click', (evt) => {
      switchClass('.wrapper .main .tab', 'selected', 'remove');
      const menu = evt.currentTarget.getAttribute('data-nav');
      switchClass('.navig h3.active', 'active');
      switchClass('.mail-types li.active', 'active');
      switchClass(`[data-nav="${menu}"]`, 'active');
      dummyData.filtered = dummyData.messages;
      runDummy();
      switchTab(menu);
    });
  });

  const subNavig = document.querySelectorAll('.mail-types li');
  subNavig.forEach((nav) => {
    nav.addEventListener('click', (evt) => {
      switchClass('.wrapper .main .tab', 'selected', 'remove');
      const menu = evt.currentTarget.getAttribute('data-nav');
      const parentMenu = evt.currentTarget.getAttribute('data-parent-nav');
      switchClass('.navig h3.active', 'active');
      switchClass(`[data-nav = "${parentMenu}"]`, 'active');
      switchClass('.mail-types li.active', 'active');
      switchClass(`[data-nav="${menu}"]`, 'active');
      switchTab(parentMenu);
      dummyData.filtered = dummyData.messages.filter((msg) => {
        if (menu === 'inbox') {
          return msg.status === 'read' || msg.status === 'unread';
        }
        return msg.status === menu;
      });
      runDummy();
    });
  });
  const inputs = document.querySelectorAll('.input-group input.inputs');

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
  const endpoint = 'http://localhost:3000/api/v1/mails';
  fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token'),
    },
  })
    .then(resp => resp.json())
    .then((res) => {
      dummyData.messages = res.data;
      dummyData.filtered = res.data;
      runDummy();
    }).catch(() => {

    });
})();
