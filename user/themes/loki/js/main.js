$(document).ready(function() {
   
   $('.nav__toggle').click(function(){
      $(this).children('div').toggleClass('open');
      $('.mobile-nav').toggleClass('open');
   });
   
   $('.nav__toggle').click(function(){
      $('#mobile-nav').toggleClass('open');
   });
   
});

$('.navTrigger').click(function () {
   $(this).toggleClass('active');
   console.log("Clicked menu");
   $("#mainListDiv").toggleClass("show_list");
   $("#mainListDiv").fadeIn();
   
});

$(window).scroll(function() {
   if ($(document).scrollTop() > 50) {
      $('.nav').addClass('affix');
      console.log("OK");
   } else {
      $('.nav').removeClass('affix');
   }
});

const lightbox = GLightbox({
   selector: 'data-gallery'
});

const lazy = (function ($) {

   var indexPostClass = '.loadAnim',
   init = function () {
      indexPostAnimate();
      $(window).on('scroll', function() {
         indexPostAnimate();
      });
   };
   function
      indexPostAnimate() {
      if ($(indexPostClass).length) {
         $(indexPostClass).each(function () {
            var postPos = $(this).offset().top;
            var topOfWindow = $(window).scrollTop(), windowHeight = $(window).height();
            if (postPos < topOfWindow + (windowHeight / 1.4)) {
               $(this).addClass('listFadeIn');
            }
         });
      }
   };
   return {
      init: init
   };
})(jQuery);

(function () {
   lazy.init();
})();

gsap.fromTo("#gsap--slideImgIntro", { scale: 1.1, opacity: 0 }, {
   duration: 1,
   scale: 1,
   opacity: 1,
   delay: 1.5,
   ease: "sine"
});