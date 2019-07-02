var lastTopPos = window.pageYOffset;
var firstScrollHappened = false;
window.addEventListener("scroll", function(e) {
  if (firstScrollHappened) {
    var navBar = document.querySelector("#navbar");
    currentTopPos = window.pageYOffset;
    if (!document.querySelector(".nav_items").classList.contains("hamb_on")) {
      if (currentTopPos < lastTopPos) {
        navBar.classList.remove("off");
      } else if (currentTopPos >= 100) {
        navBar.classList.add("off");
      }
    }
  } else {
    firstScrollHappened = true;
  }

  if (window.location.href.indexOf("index") !== -1) {
    var getStartNav = document.querySelector(".get_start_nav");
    var dlNav = document.querySelector(".dl_nav");
    var docNav = document.querySelector(".doc_nav");
    if (window.pageYOffset < 300) {
      getStartNav.classList.add("off");
      dlNav.classList.add("off");
      docNav.classList.add("off");
    } else {
      getStartNav.classList.remove("off");
      dlNav.classList.remove("off");
      docNav.classList.remove("off");
    }
  }

  lastTopPos = window.pageYOffset;
});
