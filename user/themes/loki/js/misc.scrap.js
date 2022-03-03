$(document).ready(function(){
         $(".drawings").addClass("show");
         $(".paintings").addClass("show");
         $(".uv").addClass("show");
         $(".digital").addClass("show");
         $("#showDrawings").click(function(){
            $(".drawings").addClass("show").removeClass("hide");
            $(".paintings").addClass("hide").removeClass("show");
            $(".uv").addClass("hide").removeClass("show");
            $(".digital").addClass("hide").removeClass("show");
         });
         $("#showPaintings").click(function(){
            $(".drawings").addClass("hide").removeClass("show");
            $(".paintings").addClass("show").removeClass("hide");
            $(".uv").addClass("hide").removeClass("show");
            $(".digital").addClass("hide").removeClass("show");
         });
         $("#showUV").click(function(){
            $(".drawings").addClass("hide").removeClass("show");
            $(".paintings").addClass("hide").removeClass("show");
            $(".uv").addClass("show").removeClass("hide");
            $(".digital").addClass("hide").removeClass("show");
         });
         $("#showDigital").click(function(){
            $(".drawings").addClass("hide").removeClass("show");
            $(".paintings").addClass("hide").removeClass("show");
            $(".uv").addClass("hide").removeClass("show");
            $(".digital").addClass("show").removeClass("hide");
         });
      });

      gsap.registerPlugin(Flip);

      const group = document.querySelector(".drawings", ".paintings", ".uv", ".digital");

      document.querySelector(".button").addEventListener("click", () => {
         // Get the initial state
         const state = Flip.getState(".drawings, .paintings, .uv, .digital, .gsapBox");
         
         // toggle the flex direction
         group.classList.toggle("hide");
         
         Flip.from(state, {
            absolute: true, // uses position: absolute during the flip to work around flexbox challenges
            duration: 0.5, 
            stagger: 0.1,
            ease: "power1.inOut"
            // you can use any other tweening properties here too, like onComplete, onUpdate, delay, etc. 
         });
      });
