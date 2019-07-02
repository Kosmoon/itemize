window.addEventListener("load", function() {
  var tabs = document.querySelectorAll(".tab");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function() {
      var parentTabs = tabs[i].parentNode.querySelectorAll(".tab");
      for (let z = 0; z < parentTabs.length; z++) {
        parentTabs[z].classList.remove("selected");
      }
      tabs[i].classList.add("selected");
      var parentBox = tabs[i].parentNode.parentNode;
      if (tabs[i].textContent.trim().toLowerCase() === "html") {
        parentBox.querySelector(".js_content").classList.add("hide");
        parentBox.querySelector(".html_content").classList.remove("hide");
      } else {
        parentBox.querySelector(".js_content").classList.remove("hide");
        parentBox.querySelector(".html_content").classList.add("hide");
      }
    });
  }
});
