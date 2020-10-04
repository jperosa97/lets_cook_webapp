    //navigation scroll sticky animation
    window.addEventListener("scroll", function(){
      const nav = document.querySelector("nav");
      nav.classList.toggle("sticky", window.scrollY > 0);
})
