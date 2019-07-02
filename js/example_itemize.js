window.addEventListener("load", function() {
  var itemManager = new Itemize();
  itemManager.apply({ showAddNotifications: true });

  var refreshEx1Btn = document.querySelector(".refresh_1");
  var ex1Container = document.querySelector(".example1_container");
  refreshEx1Btn.addEventListener("click", function() {
    ex1Container.innerHTML =
      '<div class="item">ITEM 1</div> <div class="item">ITEM 2</div><div class="item">ITEM 3</div><div class="item">ITEM 4</div>';
    itemManager.apply(".example1_container");
  });

  var refreshEx2Btn = document.querySelector(".refresh_2");
  var ex2Container = document.querySelector(".example2_container");
  refreshEx2Btn.addEventListener("click", function() {
    ex2Container.innerHTML =
      '<div class="cat"><img src="img/cat1.jpeg" alt=""></div><div class="cat"><img src="img/cat2.jpeg" alt=""></div><div class="cat"><img src="img/cat3.jpeg" alt=""></div><div class="cat"><img src="img/cat4.jpeg" alt=""></div>';
    applyToEx2();
  });

  var applyToEx2 = function() {
    itemManager.apply(".example2_container", {
      modalConfirm: true,
      modalText: "Remove this image?",
      showRemoveNotifications: true,
      removeNotificationText: "Cat image removed",
      notificationPosition: "bottom-center",
      removeBtnPosition: "top-left",
      removeBtnBgColor: "#ffffff"
    });
  };
  applyToEx2();

  var refreshEx3Btn = document.querySelector(".refresh_3");
  var ex3Container = document.querySelector(".example3_container");
  var addListenerToBtn = function() {
    document.querySelector(".add_btn").addEventListener("click", function() {
      var newElement = document.createElement("div");
      newElement.classList.add("item");
      newElement.textContent = "ITEM";
      document.querySelector(".example3_container").appendChild(newElement);
    });
  };
  addListenerToBtn();
  refreshEx3Btn.addEventListener("click", function() {
    ex3Container.innerHTML =
      '<button notItemize class="add_btn">Add a DOM element</button><div class="item">ITEM</div><div class="item">ITEM</div>';
    addListenerToBtn();
    itemManager.apply(".example3_container", { showAddNotifications: true });
  });

  var refreshEx4Btn = document.querySelector(".refresh_4");
  var ex4Container = document.querySelector(".example4_container");
  itemManager.apply(".example4_container", {
    removeBtnClass: "rm_btn",
    animDuration: 1000,
    animRemoveTranslateX: 200,
    animRemoveTranslateY: 100
  });
  refreshEx4Btn.addEventListener("click", function() {
    ex4Container.innerHTML =
      '<div>ITEM 1<br><button class="rm_btn">Remove me</button></div><div>ITEM 2<br><button class="rm_btn">Remove me</button></div><div>ITEM 3<br><button class="rm_btn">Remove me</button></div>';
    itemManager.apply(".example4_container", {
      removeBtnClass: "rm_btn",
      animDuration: 1000,
      animRemoveTranslateX: 200,
      animRemoveTranslateY: 100
    });
  });

  var exampleBtn = document.querySelector(".example_btn");
  exampleBtn.addEventListener("click", function() {
    window.scroll({
      top: document.querySelector(".second_section").offsetTop,
      left: 0,
      behavior: "smooth"
    });
  });

  if (window.location.href.indexOf("example") !== -1) {
    window.scroll({
      top: document.querySelector(".second_section").offsetTop,
      left: 0,
      behavior: "smooth"
    });
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
});
