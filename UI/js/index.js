(function(){
    const fetchData = (nav) => {

    }
    const switchClass = (target, toggleClass, type = "toggle")=>{
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
    const openCloseNav = ()=>{
        switchClass('.side-nav .d-arrow', 'down'); 
        switchClass('.side-nav .mail-types', 'open');
        switchClass('.top-nav .mail-types', 'open');
        switchClass('.main', 'open-sub-nav');
    }
    const switchTab = (nav, changeTab=true)=>{
        if(changeTab) {
            switchClass(`.tab.block`, 'gone', 'add');
            switchClass(`.tab.block.gone`, 'block', 'remove');
            switchClass(`.${nav}.gone`, 'block', 'add');
            switchClass(`.${nav}.gone.block`, 'gone', 'remove');
        }
        fetchData(nav);
    }
    document.querySelector('.side-nav .d-arrow').addEventListener('click', (evt)=>{
        openCloseNav();
    });
    document.querySelector('.top-nav .d-arrow').addEventListener('click', (evt)=>{
        openCloseNav();
    });
    document.querySelector('.main .navicon')
    .addEventListener('click', (evt)=>{
        switchClass('.main', 'open-nav');
    });
    document.querySelector('.main-body')
    .addEventListener('click', (evt)=>{
        switchClass('.main', 'open-nav', 'remove');
    });

    const navig = document.querySelectorAll('.navig h3');

    navig.forEach((nav)=>{
        nav.addEventListener('click', (evt)=>{
            menu = evt.currentTarget.getAttribute('data-nav');
            switchClass('.navig h3.active', 'active');
            switchClass('.mail-types li.active', 'active');
            switchClass(`[data-nav="${menu}"]`, 'active');
            switchTab(menu);
        })
    });

    const subNavig = document.querySelectorAll('.mail-types li');
    subNavig.forEach((nav)=>{
        nav.addEventListener('click', (evt)=>{
            menu = evt.currentTarget.getAttribute('data-nav');
            parentMenu = evt.currentTarget.getAttribute('data-parent-nav');
            switchClass('.navig h3.active', 'active');
            switchClass(`[data-nav = "${parentMenu}"]`, 'active');
            switchClass('.mail-types li.active', 'active');
            switchClass(`[data-nav="${menu}"]`, 'active');
            switchTab(menu, false);
        })
    })
})();


/* $('.navig > li').on('click', (evt)=>{
    document.querySelector('.navig > li.active').classList('data-nav');
    let prevMenu = $('.navig > li.active').attr('data-index');
    let selected = $(evt.currentTarget);
    let menu = selected.attr('data-index');
    if(prevMenu == menu) return;
    $('.navig > li').removeClass('active');
    $('.navig').find(`[data-index='${menu}']`).addClass('active');
    $('.mail-types > li').removeClass('active');
    selected.find('li') ? selected.find('li').removeClass('active') : null;
});
$('.mail-types > li').on('click', (evt)=>{
    let selected = $(evt.currentTarget);
    console.log(selected);
    $('.mail-types > li').removeClass('active');
    let menu = selected.attr('data-index');
    $('.mail-types').find(`[data-index='${menu}']`).addClass('active');
    selected.find('li') ? selected.find('li').removeClass('active') : null;
}); */
/* $(window).resize(organiseSidebar);

function organiseSidebar(){
    var windowWidth = $(window).width();
    (windowWidth > 992) ? resizesideleft() : resizesidetop();
    console.log (windowWidth);
}
function resizesidetop(){
    console.log('wq');
    $('.wrapper').addClass('min');
}
function resizesideleft(){
    console.log('pp');
    $('.wrapper').removeClass('min');

} */