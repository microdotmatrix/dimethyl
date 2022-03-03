const swup = new Swup();

function init() {
   if (document.querySelector('.parallax')) {
       // something like new Carousel('#carousel')
   }
}

// this event runs for every page view after initial load
swup.on('contentReplaced', init);

function unload() {
   if (document.querySelector('.parallax')) {
       // carousel.destroy()
   }
   // ...
}

swup.on('willReplaceContent', unload);