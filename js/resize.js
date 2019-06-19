window.addEventListener("resize", function(e) {
  if (window.innerWidth > 900) {
    var navMenu = document.querySelector(".nav_items");
    var hamb = document.querySelector(".hamburger");
    navMenu.classList.remove("hamb_on");
    hamb.classList.remove("is-active");
  }
});
