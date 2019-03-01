(()=>{
/* test files */
    let switchClass = (target, toggleClass, type = "toggle")=>{
        try{
            let navs = document.querySelectorAll(`${target}`);
            navs.forEach((nav)=>{
                if(type=='toggle')nav.classList.toggle(toggleClass);
                if(type=='add')nav.classList.add(toggleClass);
                if(type=='remove')nav.classList.remove(toggleClass);
            });
        }catch(e){
            console.error(e);
            return false;
        }
        return true;
    }
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
                firstName: 'fred',
                lastName: 'delight',
                subject: "get in the car, you're late",
                message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                deliveryDate: 'Sun 11th, Aug 2018',
                type: 'recieved',
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
                firstName: 'fred',
                lastName: 'delight',
                subject: "get in the car, you're late",
                message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                deliveryDate: 'Sun 11th, Aug 2018',
                type: 'recieved',
            },
            {
                firstName: 'fred',
                lastName: 'delight',
                subject: "get in the car, you're late",
                message: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
                deliveryDate: 'Sun 11th, Aug 2018',
                type: 'recieved',
            },
        ]
    };
    const runDummy = ()=>{
        let strHtml = '';
        let counter = 0;
        dummyData.messages.forEach((msg)=>{
            strHtml += `
            <div class="post anim" data-index = "${counter++}">
                <div class="dp"></div>
                <div class="details">
                    <h4>${msg.firstName} ${msg.lastName}</h4>
                    <p class="subject">${msg.subject}</p>
                    <div><span class="type">${msg.type}</span><span class="date">${msg.deliveryDate}</span></div>
                </div>
                <div class="clr"></div>
            </div>
            `
        })
        document.querySelector('.content-wrapper').innerHTML = strHtml;
    }
    runDummy();
    const posts = document.querySelectorAll('.post');
    posts.forEach((post)=>{
        post.addEventListener('click', (evt)=>{
            switchClass('.wrapper .main .tab', 'selected', 'toggle');
            switchClass('.mails .post', 'active', 'remove');
            switchClass('.mails .post', 'opac-70', 'add');
            evt.currentTarget.classList.add('active');
            switchClass('.mails .post.active', 'opac-70', 'remove');
            let index = evt.currentTarget.getAttribute('data-index');
            let msg = dummyData.messages[index];
            console.log(index, msg, evt.target);
            document.querySelector('.content-wrapper-bloated').innerHTML = `
            <div class="post-bloated">
                <h3>${msg.firstName} ${msg.lastName}</h3>
                <p class="subject">${msg.subject}</p>
                <p class="msg">${msg.message}</p>
                <p class="date">${msg.deliveryDate}</p>
            </div>
            `
        })
    })
})()