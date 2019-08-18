"use strict";

window.addEventListener("load", function() {
  var hamb = document.querySelector(".hamburger");
  hamb.addEventListener("click", function() {
    var navMenu = document.querySelector(".nav_items");
    navMenu.classList.toggle("hamb_on");
    hamb.classList.toggle("is-active");
  });
  var navItems = document.querySelectorAll(".nav_item");

  for (var i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener("click", function() {
      var navMenu = document.querySelector(".nav_items");
      navMenu.classList.remove("hamb_on");
      navMenu.classList.add("hamb_off");
      hamb.classList.toggle("is-active");
    });
  }
});
