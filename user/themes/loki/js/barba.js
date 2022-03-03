barba.init({
   schema: {
      prefix: 'data-trans'
   },
   views: [{
      namespace: 'home',
      beforeEnter() {
         // update the menu based on user navigation
         menu.update();
      },
      afterEnter() {
         // refresh the parallax based on new page content
         parallax.refresh();
      }
   }],
   transitions: [{
      name: 'opacity-transition',
      leave(data) {
         return gsap.to(data.current.container, {
            opacity: 0
         });
      },
      enter(data) {
         return gsap.from(data.next.container, {
            opacity: 0
         });
      }
   }]
})