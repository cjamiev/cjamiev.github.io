$( document ).ready(function() {
	
$('.menu').hide(0);

$('.header p').click(function() {
  $('.menu').toggle(0);
  $('.header-extra').toggle(0);
  $('.menu li').click(function(){
    $('.menu').hide(0);
    $('.header-extra').show(0);
  });
});

});