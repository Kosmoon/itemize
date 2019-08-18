window.addEventListener("load", function() {
  var menuItems = document.querySelectorAll(
    "#left_content h1, #left_content h2"
  );
  for (var i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener("click", function() {
      for (var z = 0; z < menuItems.length; z++) {
        menuItems[z].classList.remove("selected");
      }
      this.classList.add("selected");
      var selectedOption = this.textContent;
      var optionsTd = document.querySelectorAll(
        ".table_options .name, .table_public_prop .name"
      );
      var optionsTr = document.querySelectorAll(
        ".table_options tr, .table_public_prop tr"
      );
      for (var h = 0; h < optionsTr.length; h++) {
        optionsTr[h].classList.remove("highlight");
      }
      for (var j = 0; j < optionsTd.length; j++) {
        var tableClassName =
          optionsTd[j].parentNode.parentNode.parentNode.classList[0];
        if (optionsTd[j].textContent === selectedOption) {
          window.scroll({
            top:
              document.querySelector("." + tableClassName).offsetTop +
              optionsTd[j].offsetTop -
              window.innerHeight * 0.5 +
              optionsTd[j].parentNode.offsetHeight * 0.5,
            left: 0,
            behavior: "smooth"
          });
          optionsTd[j].parentNode.classList.add("highlight");
        }
      }
      if (selectedOption === "Public Methods" || selectedOption === "apply") {
        window.scroll({
          top: document.querySelector("#right_content").offsetTop - 90,
          left: 0,
          behavior: "smooth"
        });
      }
      if (selectedOption === "cancel") {
        window.scroll({
          top: document.querySelector(".cancel").offsetTop - 90,
          left: 0,
          behavior: "smooth"
        });
      }
      if (selectedOption === "Options") {
        window.scroll({
          top: document.querySelector(".options").offsetTop - 90,
          left: 0,
          behavior: "smooth"
        });
      }
      if (selectedOption === "Public Properties") {
        window.scroll({
          top: document.querySelector(".public_prop").offsetTop - 90,
          left: 0,
          behavior: "smooth"
        });
      }
    });
  }
});
