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
let datecreated;
const generateMails = (msg, index) => {
  let { status } = msg;
  if (localStorage.getItem('id') === String(msg.senderid) && msg.status !== 'draft') {
    status = msg.status === 'read' ? 'seen' : 'delivered';
  }
  let strHtml = msg.createdon !== datecreated || index === 0 ? `<div class="w-100 datecreated"><hr/><span>${msg.createdon}</span><hr/></div>` : '';
  datecreated = msg.createdon;
  strHtml += `
    <div id = 'post-${index}' class="post pointer anim" data-id = "${msg.id}">
        <div class="dp" style = "background-image: url('../UI-elements/dp.png');"></div>
        <div class="details">
            <h4>${msg.firstname} ${msg.lastname}</h4>
            <p class="subject">${msg.subject}</p>
            <div><span class="type">${status}</span><span class="date">${msg.senttime}</span></div>
        </div>
        <div class="clr"></div>
    </div>
    `;
  document.querySelector('.content-wrapper').insertAdjacentHTML('beforeend', strHtml);
  document.querySelector(`#post-${index}`).addEventListener('click', async (evt) => {
    dummyData.selected = dummyData.data.find(elem => Number(elem.id) === Number(evt.currentTarget.getAttribute('data-id')));
    console.log(dummyData.selected);
    selectPost(evt);
    server(
      `messages/${msg.id}`, 'GET', {},
      (res) => {
        const msgById = res.data[0];
        let msgstatus = msgById.status;
        if (localStorage.getItem('id') === String(msgById.senderid) && msgById.status !== 'draft') {
          msgstatus = msgById.status === 'read' ? 'seen' : 'delivered';
        }
        console.log(msgById);
        /* console.log(document.querySelector(`[data-nav = "${parentMenu}"] .type`).innerHTML); */
        let bloatedMsg = `
          <div class="post-bloated">
              <div class = "dp" style = "background-image: url('../UI-elements/dp.png');"></div>
              <h3>${msgById.firstname} ${msgById.lastname}</h3>
              <p class="subject">${msgById.subject}</p>
              <div class= 'bodyhead'>
                <span>${msgstatus}</span>
                <p class="date">${msgById.createdon} | ${msgById.senttime}</p>
                <div class="clr"></div>
              </div>
              <div class="msgcon">
                <p class="msg">${msgById.message}</p>
              </div>
              <div class="msgaction">
                <button class="centercon modalopen btn ${(localStorage.getItem('id') === String(msgById.senderid) && msgById.status === 'read') || (localStorage.getItem('id') !== String(msgById.senderid)) ? 'gone' : ''}"><a class = "center wht updateMail h-100" data-mail = "update">Update</a></button>
                <button data-mail="delete" class="centercon alertopen btn"> ${msgById.status !== 'unread' ? 'Delete' : 'Retract'}</button>
                <button class="${msgById.status === 'draft' ? 'alertopen' : 'modalopen'} btn ${localStorage.getItem('id') === String(msgById.senderid) && msgById.thread.length === 0 && msgById.status !== 'draft' ? 'gone' : ''}"><a class = "center wht sendReplyMail h-100" data-mail = "${msgById.status === 'draft' ? 'send' : 'reply'}">${msgById.status === 'draft' ? 'Send' : 'Reply'}</a></button>
              </div>
              <div class="thread">
                <div class="head">
                  <h5 class="float-left">Replies</h5>
                  <span class="float-right">${msgById.thread.length}</span>
                  <div class="clr"></div>
                </div>
                <div class="w-100 body">`;
        console.log(msgById.thread);
        msgById.thread.forEach((elem) => {
          bloatedMsg += `
            <div class="reply ${elem.email === localStorage.getItem('email') ? 'sender' : 'receiver'}" id="reply-${elem.id}">
            <h3 class="txt">${elem.email === localStorage.getItem('email') ? 'me' : elem.firstname}</h3>
            <p class="txt">${elem.message}</p>
            </div>
            <div class="clr"></div>
          `;
        });
        bloatedMsg += '</div></div></div>';
        document.querySelector('.content-wrapper-bloated').innerHTML = bloatedMsg;
        modalActivate();
      },
      (err) => {
        console.log(err);
      },
    );
  });
};
