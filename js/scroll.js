var lastTopPos = window.pageYOffset;
window.addEventListener("scroll", function(e) {
  var navBar = document.querySelector("#navbar");
  currentTopPos = window.pageYOffset;
  if (!document.querySelector(".nav_items").classList.contains("hamb_on")) {
    if (currentTopPos < lastTopPos) {
      navBar.classList.remove("off");
    } else if (currentTopPos >= 100) {
      navBar.classList.add("off");
    }
  }

  lastTopPos = window.pageYOffset;
});
