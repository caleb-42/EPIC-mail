toggle = (targetClass, toggleClass)=>{
    document.querySelector(`.${targetClass}`).classList.toggle(toggleClass);
}

closeOpen = () => {
    console.log('sdf');
    document.querySelector('.mail-types').classList.toggle('open');
}

activate = (node) => {
    document.querySelector('nav > li').classList.add()
    node.classList.add('active');
}
closeOpenTopNav = () => {
    $('.top-nav').toggleClass('open');
}
closeOpenTopSubNav = () => {
    $('.top-nav .mail-types').toggleClass('open');
    $('.top-nav').toggleClass('sub');
}
$('.navig > li').on('click', (evt)=>{
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
});
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