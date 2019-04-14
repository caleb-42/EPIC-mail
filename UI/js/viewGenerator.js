/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const fillSubPage = (html) => {
  document.querySelectorAll('.content-wrapper-bloated').forEach((elem) => { elem.innerHTML = html; });
};

let datecreated;

const loadBloatedMails = (msgById) => {
  console.log(msgById);
  document.querySelector('.mails .content-wrapper-bloated').innerHTML = mailPostBloated(msgById);
  modalActivate();
};

const generateBloatedMails = (obj, msg) => {
  fillSubPage(loading);
  dummyData.selected = dummyData.data.find(elem => Number(elem.id) === Number(obj.getAttribute('data-id')));
  selectPost(obj);
  server(
    `messages/${msg.id}`, 'GET', {},
    (res) => {
      if (res.error) fillSubPage(htmlServerResponse('Unauthorized Access'));
      console.log(res.data);
      if (dummyData.data.length === 0) fillSubPage(htmlServerResponse());
      else fillSubPage('');
      const msgById = res.data[0];
      document.querySelector('.mails .content-wrapper-bloated').innerHTML = mailPostBloated(msgById);
      modalActivate();
    },
    (err) => {
      fillSubPage(failedResponse);
      reconnect(() => {
        generateBloatedMails(obj, msg);
      });
      console.log(err);
    },
  );
};

const generateMails = (msg, index) => {
  let { status } = msg;
  if (localStorage.getItem('id') === String(msg.senderid) && msg.status !== 'draft') {
    status = msg.status === 'read' ? 'seen' : 'delivered';
  }

  datecreated = msg.createdon;
  document.querySelector('.mails .content-wrapper').insertAdjacentHTML('beforeend', mailPost(msg, index, datecreated, status));
  document.querySelector(`#post-${index}`).addEventListener('click', async (evt) => {
    generateBloatedMails(evt.currentTarget, msg);
  });
};

const groupPostBloatedGroup = (groupMembers, i) => {
  console.log(groupMembers);
  let str = '';
  groupMembers.forEach((member, index) => {
    str += groupPostBloated(member, index, i);
    console.log(index, groupMembers.length);
  });
  return str;
};

const loadBloatedGroups = (groupMembers, index) => {
  document.querySelector('.groups .content-wrapper-bloated').innerHTML = groupPostBloatedGroup(groupMembers, index);
};

const generateBloatedGroups = (obj, group, evt, index) => {
  dummyData.selected = dummyData.data.find(elem => Number(elem.id) === Number(obj.getAttribute('data-id')));
  if (!selectPost(obj, evt.target)) return;
  fillSubPage(loading);
  server(
    `groups/${group.id}/users`, 'GET', {},
    (res) => {
      if (res.error) fillSubPage(htmlServerResponse('Unauthorized Access'));
      console.log(res.data);
      if (dummyData.data.length === 0) fillSubPage(htmlServerResponse());
      else fillSubPage('');
      const groupMembers = res.data;
      loadBloatedGroups(groupMembers, index);
      modalActivate();
    },
    (err) => {
      fillSubPage(failedResponse);
      reconnect(() => {
        generateBloatedGroups(obj, group, evt, index);
      });
      console.log(err);
    },
  );
};
const generateGroups = (group, index, last) => {
  console.log(group);
  document.querySelector('.groups .content-wrapper').insertAdjacentHTML('beforeend', groupPost(group, index));
  if (index === last - 1) modalActivate();
  document.querySelector(`#post-${index}`).addEventListener('click', async (evt) => {
    console.log('loading');
    generateBloatedGroups(evt.currentTarget, group, evt, index);
  });
};
