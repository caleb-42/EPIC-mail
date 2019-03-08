(() => {
  const authenticate = () => {
    /* const email = localStorage.getItem('email');
    const password = localStorage.getItem('password'); */
    const signin = localStorage.getItem('email');
    if (!signin) window.location.href = './signUp.html';
  };
  const dummyData = {
    messages: [
      {
        id: 1,
        createdOn: 'Sat 18th, Mar 2011',
        subject: 'i just registered',
        receiverId: 2,
        senderId: 1,
        mailerName: 'paul jekande',
        message: 'its so wonderful to be part of this app',
        parentMessageId: undefined,
        status: 'unread',
      },
      {
        id: 3,
        createdOn: 'Sun 11th, Aug 2018',
        receiverId: 1,
        senderId: 2,
        mailerName: 'fred delight',
        subject: "get in the car, you're late",
        message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        parentMessageId: undefined,
        status: 'sent',
      },
      {
        id: 4,
        createdOn: 'Thu 23rd, Jan 2019',
        receiverId: 2,
        senderId: 1,
        mailerName: 'fred delight',
        subject: 'hello, missed your call',
        message: "I'm so sorry, i was at the inn when you called martins, Lorem Ipsum is simply dummy text",
        parentMessageId: undefined,
        status: 'read',
      },
      {
        id: 6,
        createdOn: 'Sat 23rd, Jun 2015',
        receiverId: 1,
        senderId: 2,
        mailerName: 'kunle sambo',
        subject: 'the staff meeting',
        message: 'dont let the board members get on your nerves they have terrible manners',
        parentMessageId: undefined,
        status: 'draft',
      },
    ],
    filtered: [],
  };
  dummyData.filtered = dummyData.messages;
  /* let endpoint = 'http://localhost:3000/api/v1/messages'; */
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
  document.querySelector('.d-arrow').addEventListener('click', openCloseNav);
  document.querySelector('.top-nav .d-arrow').addEventListener('click', openCloseNav);

  const switchEvents = (target, arg) => {
    document.querySelector(target)
      .addEventListener('click', () => {
        switchClass(arg[0], arg[1], arg[2]);
      });
  };
  switchEvents('.main .navicon', ['.main', 'open-nav', 'toggle']);
  switchEvents('.main-body', ['.main', 'open-nav', 'remove']);

  const resetTab = () => {
    switchClass('.wrapper .main', 'selected', 'remove');
    setTimeout(() => {
      switchClass('.tab.block .left-body.tab-content', 'display', 'remove');
      switchClass('.tab.block .right-body.tab-content', 'display', 'add');
    }, 500);
  };
  document.querySelector('.backbtn').addEventListener('click', () => {
    resetTab();
  });
  document.querySelectorAll('.custom-modal').forEach((elem) => {
    elem.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('modal'))window.location.href = './index.html#';
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
  /* const server = async (url = '', method = '', resolve = () => {}, headers = {
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
  }; */
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
  /* server(endpoint, 'GET', (res) => {
    dummyData.messages = res.data;
    runDummy();
  }); */
  runDummy();
})();
