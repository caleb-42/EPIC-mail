(() => {
/* test files */
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
  const dummyData = {
    messages: [
      {
        firstName: 'paul',
        lastName: 'jekande',
        subject: 'hello, missed your call',
        message: "I'm so sorry, i was at the inn when you called martins, Lorem Ipsum is simply dummy text",
        deliveryDate: 'Thu 23rd, Jan 2019',
        type: 'sent',
      },
      {
        firstName: 'fred',
        lastName: 'delight',
        subject: "get in the car, you're late",
        message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        deliveryDate: 'Sun 11th, Aug 2018',
        type: 'recieved',
      },
      {
        firstName: 'okoro',
        lastName: 'stephen',
        subject: 'u ahave come again abi',
        message: 'i told you to stop coming to this office',
        deliveryDate: 'Wed 30th, Dec 2002',
        type: 'sent',
      },
      {
        firstName: 'martins',
        lastName: 'sultan',
        subject: 'the staff meeting',
        message: 'dont let the board members get on your nerves they have terrible manners',
        deliveryDate: 'Sat 23rd, Jun 2015',
        type: 'draft',
      },
      {
        firstName: 'mikel',
        lastName: 'obi',
        subject: 'you didnt win',
        message: 'the match was a draw stop kidding yourself, we played better',
        deliveryDate: 'Tue 5th, Feb 2012',
        type: 'sent',
      },
      {
        firstName: 'micheal',
        lastName: 'jackson',
        subject: 'you are very wrong',
        message: "i am not dead, i just got beamed back into the 80's, i'll be back for all you haters",
        deliveryDate: 'Mon 11th, Oct 2009',
        type: 'recieved',
      },
    ],
  };
  const runDummy = () => {
    let strHtml = '';
    let counter = 0;
    dummyData.messages.forEach((msg) => {
      strHtml += `
            <div class="post anim" data-index = "${counter}">

                <div class="dp"></div>
                <div class="details">
                    <h4>${msg.firstName} ${msg.lastName}</h4>
                    <p class="subject">${msg.subject}</p>
                    <div><span class="type">${msg.type}</span><span class="date">${msg.deliveryDate}</span></div>
                </div>
                <div class="clr"></div>
            </div>
            `;
      counter += 1;
    });
    document.querySelector('.content-wrapper').innerHTML = strHtml;
  };
  runDummy();
  const posts = document.querySelectorAll('.post');
  posts.forEach((post) => {
    post.addEventListener('click', (evt) => {
      switchClass('.wrapper .main .tab', 'selected', 'toggle');
      switchClass('.mails .post', 'active', 'remove');
      switchClass('.mails .post', 'opac-70', 'add');
      evt.currentTarget.classList.add('active');
      switchClass('.mails .post.active', 'opac-70', 'remove');
      const index = evt.currentTarget.getAttribute('data-index');
      const msg = dummyData.messages[index];
      console.log(index, msg, evt.target);
      document.querySelector('.content-wrapper-bloated').innerHTML = `
            <div class="post-bloated">
                <h3>${msg.firstName} ${msg.lastName}</h3>
                <p class="subject">${msg.subject}</p>
                <p class="msg">${msg.message}</p>
                <p class="date">${msg.deliveryDate}</p>
            </div>
            `;
    });
  });
})();
