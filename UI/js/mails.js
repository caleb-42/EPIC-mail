/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let datecreated;
const generateMails = (msg, index) => {
  let { status } = msg;
  if (localStorage.getItem('id') === String(msg.senderid) && msg.status !== 'draft') {
    status = msg.status === 'read' ? 'seen' : 'delivered';
  }
  let strHtml = msg.createdon !== datecreated || index === 0 ? `<div class="w-100 datecreated"><hr class="w-20 inline-block"/><span class="w-20 text-center">${msg.createdon}</span><hr class="w-20 inline-block"/></div>` : '';
  datecreated = msg.createdon;
  strHtml += `
    <div id = 'post-${index}' class="post wht block pointer anim" data-id = "${msg.id}">
        <div class="dp img-con mx-auto float-left" style = "background-image: url('../UI-elements/dp.png');"></div>
        <div class="details float-right">
            <h4 class="text-left">${msg.firstname} ${msg.lastname}</h4>
            <p class="subject text-left">${msg.subject}</p>
            <div><span class="type w-20 float-left text-left">${status}</span><span class="date w-80 float-right text-right">${msg.senttime}</span></div>
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
              <div class = "dp img-con mx-auto" style = "background-image: url('../UI-elements/dp.png');"></div>
              <h3>${msgById.firstname} ${msgById.lastname}</h3>
              <p class="subject fw-600 text-center">${msgById.subject}</p>
              <div class= 'bodyhead'>
                <span class="fw-600 wht float-left text-center">${msgstatus}</span>
                <p class="date fw-600 float-right text-center">${msgById.createdon} | ${msgById.senttime}</p>
                <div class="clr"></div>
              </div>
              <div class="msgcon w-100 ovflo-y h-fit">
                <p class="msg">${msgById.message}</p>
              </div>
              <div class="msgaction horizon-spread">
                <button data-mail = "update" class="wht fw-600 anim updateMail modalopen btn ${(localStorage.getItem('id') === String(msgById.senderid) && msgById.status === 'read') || (localStorage.getItem('id') !== String(msgById.senderid)) ? 'gone' : ''}">Update</button>
                <button data-mail="delete" class="wht fw-600 anim alertopen btn"> ${msgById.status !== 'unread' ? 'Delete' : 'Retract'}</button>
                <button data-mail = "${msgById.status === 'draft' ? 'send' : 'reply'}" class="wht fw-600 sendReplyMail anim ${msgById.status === 'draft' ? 'alertopen' : 'modalopen'} btn ${localStorage.getItem('id') === String(msgById.senderid) && msgById.thread.length === 0 && msgById.status !== 'draft' ? 'gone' : ''}">${msgById.status === 'draft' ? 'Send' : 'Reply'}</button>
              </div>
              <div class="thread">
                <div class="head">
                  <h5 class="float-left">Replies</h5>
                  <span class="float-right vt-center">${msgById.thread.length}</span>
                  <div class="clr"></div>
                </div>
                <div class="w-100 body">`;
        console.log(msgById.thread);
        msgById.thread.forEach((elem) => {
          bloatedMsg += `
            <div class="reply block ${elem.email === localStorage.getItem('email') ? 'sender float-left text-left' : 'receiver float-right text-right'}" id="reply-${elem.id}">
            <h3 class="txt w-100">${elem.email === localStorage.getItem('email') ? 'me' : elem.firstname}</h3>
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
