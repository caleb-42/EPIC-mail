/* eslint-disable no-unused-vars */
const strangerEmailField = `<label for="email" class="email anim ">Receiver</label>
<input required type="text" id="email" class="inputs" placeholder = "Email" name="email" />`;

const contactEmailField = (optionData = []) => {
  let str = '<select class="inputs email" name="email"><option value="" selected disabled>Select Contact</option>';
  optionData.forEach((elem) => {
    str += `<option value="${elem.email}">${elem.firstname} ${elem.lastname}</option>`;
  });
  str += '</select>';
  return str;
};

const groupIdField = (optionData = []) => {
  let str = '<select class="inputs groupid" name=groupid><option value=0 selected disabled>Select Group</option>';
  optionData.forEach((elem) => {
    str += `<option value="${elem.id}">${elem.name}</option>`;
  });
  str += '</select>';
  return str;
};

const mailPost = (msg, index, datecreated, status) => {
  let str = msg.createdon !== datecreated || index === 0 ? `<div class="w-100 datecreated"><hr class="w-20 inline-block"/><span class="w-20 text-center">${msg.createdon}</span><hr class="w-20 inline-block"/></div>` : '';
  str += `
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
  return str;
};

const mailPostBloated = (msgById, msgstatus) => {
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
        <button data-modal = "#newMailModal" data-action = "update" class="wht fw-600 anim updateMail modalopen btn ${(localStorage.getItem('id') === String(msgById.senderid) && msgById.status === 'read') || (localStorage.getItem('id') !== String(msgById.senderid)) ? 'gone' : ''}">Update</button>
        <button data-action="delete" class="wht fw-600 anim alertopen btn"> ${msgById.status !== 'unread' ? 'Delete' : 'Retract'}</button>
        <button ${msgById.status === 'draft' ? '' : 'data-modal = "#newMailModal"'} data-action = "${msgById.status === 'draft' ? 'send' : 'reply'}" class="wht fw-600 sendReplyMail anim ${msgById.status === 'draft' ? 'alertopen' : 'modalopen'} btn ${localStorage.getItem('id') === String(msgById.senderid) && msgById.thread.length === 0 && msgById.status !== 'draft' ? 'gone' : ''}">${msgById.status === 'draft' ? 'Send' : 'Reply'}</button>
      </div>
      <div class="thread">
        <div class="head">
          <h5 class="float-left">Replies</h5>
          <span class="float-right vt-center">${msgById.thread.length}</span>
          <div class="clr"></div>
        </div>
        <div class="w-100 body">`;
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
  return bloatedMsg;
};
