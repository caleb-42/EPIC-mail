/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const groupPostBloatedGroup = (groupMembers, i) => {
  console.log(groupMembers);
  let str = '';
  groupMembers.forEach((member, index) => {
    str += groupPostBloated(member, index, i);
    console.log(index, groupMembers.length);
  });
  return str;
};

const generateBloatedGroups = (obj, group, evt, index) => {
  dummyData.selected = dummyData.data.find(elem => Number(elem.id) === Number(obj.getAttribute('data-id')));
  console.log(dummyData.selected);
  if (!selectPost(evt.currentTarget, evt.target)) return;
  server(
    `groups/${group.id}/users`, 'GET', {},
    (res) => {
      console.log(res.data);
      const groupMembers = res.data;
      document.querySelector('.groups .content-wrapper-bloated').innerHTML = groupPostBloatedGroup(groupMembers, index);
      modalActivate();
    },
    (err) => {
      console.log(err);
    },
  );
};

const generateGroups = (group, index, last) => {
  console.log(group);
  document.querySelector('.groups .content-wrapper').insertAdjacentHTML('beforeend', groupPost(group, index));
  if (index === last - 1) modalActivate();
  document.querySelector(`#post-${index}`).addEventListener('click', async (evt) => {
    generateBloatedGroups(evt.currentTarget, group, evt, index);
  });
};
