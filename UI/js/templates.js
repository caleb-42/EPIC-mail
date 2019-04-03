/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
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
const generateMails = (msg, index) => {
  const strHtml = `
            <div id = 'post-${index}' class="post pointer anim" data-id = "${msg.id}">

                <div class="dp"></div>
                <div class="details">
                    <h4>${msg.firstname} ${msg.lastname}</h4>
                    <p class="subject">${msg.subject}</p>
                    <div><span class="type">${msg.status}</span><span class="date">${msg.createdon}</span></div>
                </div>
                <div class="clr"></div>
            </div>
            `;
  document.querySelector('.content-wrapper').insertAdjacentHTML('beforeend', strHtml);
  document.querySelector(`#post-${index}`).addEventListener('click', async (evt) => {
    /* console.log(evt);
    selectPost(evt);
    document.querySelector('.content-wrapper-bloated').innerHTML = `
      <div class="post-bloated">
          <h3>${msg.firstname} ${msg.lastname}</h3>
          <p class="subject">${msg.subject}</p>
          <p class="msg">${msg.message}</p>
          <p class="date">${msg.createdon}</p>
      </div>
      `; */
    selectPost(evt);
    server(
      `messages/${msg.id}`, 'GET', {},
      (res) => {
        const msgById = res.data[0];
        console.log(msgById);
        document.querySelector('.content-wrapper-bloated').innerHTML = `
          <div class="post-bloated">
              <h3>${msgById.firstname} ${msgById.lastname}</h3>
              <p class="subject">${msgById.subject}</p>
              <p class="msg">${msgById.message}</p>
              <p class="date">${msgById.createdon}</p>
          </div>
          `;
      },
      (err) => {
        console.log(err);
      },
    );
  });
};
