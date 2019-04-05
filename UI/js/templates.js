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
  let { status } = msg;
  if (localStorage.getItem('id') === String(msg.senderid)) {
    status = msg.status === 'read' ? 'seen' : 'delivered';
  }
  const strHtml = `
            <div id = 'post-${index}' class="post pointer anim" data-id = "msg-${msg.id}">

                <div class="dp" style = "background-image: url('../UI-elements/dp.png');"></div>
                <div class="details">
                    <h4>${msg.firstname} ${msg.lastname}</h4>
                    <p class="subject">${msg.subject}</p>
                    <div><span class="type">${status}</span><span class="date">${msg.createdon}</span></div>
                </div>
                <div class="clr"></div>
            </div>
            `;
  document.querySelector('.content-wrapper').insertAdjacentHTML('beforeend', strHtml);
  document.querySelector(`#post-${index}`).addEventListener('click', async (evt) => {
    selectPost(evt);
    server(
      `messages/${msg.id}`, 'GET', {},
      (res) => {
        const msgById = res.data[0];
        console.log(msgById);
        /* console.log(document.querySelector(`[data-nav = "${parentMenu}"] .type`).innerHTML); */
        document.querySelector('.content-wrapper-bloated').innerHTML = `
          <div class="post-bloated">
              <div class = "dp" style = "background-image: url('../UI-elements/dp.png');"></div>
              <h3>${msgById.firstname} ${msgById.lastname}</h3>
              <p class="subject">${msgById.subject}</p>
              <div class= 'bodyhead'>
                <span>Message</span>
                <p class="date">${msgById.createdon}</p>
                <div class="clr"></div>
              </div>
              <div class="msgcon">
                <p class="msg">${msgById.message}</p>
              </div>
              <div class="msgaction">
                <button class="btn ${localStorage.getItem('id') === String(msgById.senderid) && msgById.status === 'read' ? 'gone' : ''}">Update</button>
                <button class="btn"> ${msgById.status === 'read' ? 'Delete' : 'Retract'}</button>
                <button class="btn ${localStorage.getItem('id') === String(msgById.senderid) && msgById.thread.length === 0 ? 'gone' : ''}">${msgById.status === 'draft' ? 'Send' : 'Reply'}</button>
              </div>
          </div>
          `;
      },
      (err) => {
        console.log(err);
      },
    );
  });
};
