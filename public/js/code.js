//navigation scroll sticky animation
    window.addEventListener("scroll", function(){
      const nav = document.querySelector("nav");
      nav.classList.toggle("sticky", window.scrollY > 0);
})
//Accordion script abrufen
const accordion = document.getElementsByClassName('contentBx');
for (i = 0; i < accordion.length; i++) {
  accordion[i].addEventListener('click', function(){
    this.classList.toggle('active');
  })
}
