/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const strangerEmailField = `<label for="email" class="email anim ">Receiver</label>
<input required type="text" id="email" class="inputs" placeholder = "Email" name="email" />`;

const failedResponse = `<div class="emptyResp waitdiv centercon">
    <div class= "wait">
      <h4>Bad Network Connection</h4>
      <button class="btn tryagain center">Try Again</button>
    </div>
</div>`;

const loading = `<div class="waitdiv loading w-100 h-100 centercon">
    <div class="loader center"></div>
</div>`;

const htmlServerResponse = (msg = 'Empty Response') => `<div class="waitdiv loading w-100 h-100 centercon">
    <h4 class="opac-70 center">${msg}<h4>
  </div>`;

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
  console.log(dummyData.selected.id, msg.id);
  let str = msg.createdon !== datecreated || index === 0 ? `<div class="w-100 datecreated"><hr class="w-20 inline-block"/><span class="w-20 text-center">${msg.createdon}</span><hr class="w-20 inline-block"/></div>` : '';
  str += `
    <div id = 'post-${index}' class="post ${dummyData.selected.id === msg.id ? 'active' : ''} wht block pointer anim" data-id = "${msg.id}">
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

const groupPost = (group, index) => {
  const str = `
    <div id = 'post-${index}' class="post ${dummyData.selected.id === group.id ? 'active' : ''} wht block pointer anim" data-id = "${group.id}">
        <div class="dp img-con mx-auto float-left" style = "background-image: url('../UI-elements/dpgroup.png');"></div>
        <div class="details float-right">
            <h4 class="text-left">${group.name}</h4>
        </div>
        <div class="clr"></div>
        <div class="post-actions float-right">
        <div class="trash alertopen anim img-con opac-70" data-post-id = ${group.id} data-action="deletegroup"></div>
        <div class="edit anim modalopen img-con" data-post-id = ${group.id} data-action="editgroup" data-modal="#newGroupModal"></div>
        <div class="clr"></div>
        </div>
    </div>
    `;
  return str;
};

const groupPostBloated = (member, index, i) => {
  const str = `
    <div id = 'post-${i}-${index}' class="post wht block pointer anim" data-id = "${index}">
        <div class="dp img-con mx-auto float-left" style = "background-image: url('../UI-elements/dp.png');"></div>
        <div class="details float-right">
            <h4 class="text-left">${member.firstname} ${member.lastname}</h4>
            <p class="subject text-left">${member.email}</p>
        </div>
        <div class="clr"></div>
        <div class="post-actions float-right">
        <div class="trash alertopen anim img-con opac-70" data-action = "deletegroupmember" data-group-id = ${member.groupid} data-post-id = ${member.id}></div>
        <div class="clr"></div>
        </div>
    </div>
    `;
  return str;
};

const mailPostBloated = (msgById) => {
  let msgstatus = msgById.status;
  if (localStorage.getItem('id') === String(msgById.senderid) && msgById.status !== 'draft') {
    msgstatus = msgById.status === 'read' ? 'seen' : 'delivered';
  }
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
