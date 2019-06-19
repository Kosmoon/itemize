window.addEventListener("load", function() {
  var tl = anime.timeline({
    easing: "easeOutExpo",
    loop: true
  });
  tl.add({
    targets: [".js_j", ".js_s"],
    borderColor: "#597180",
    duration: 1500,
    delay: 1000
  });
  tl.add(
    {
      targets: ".close",
      opacity: 0.5,
      duration: 1000
    },
    "-=600"
  );

  tl.add(
    {
      targets: ".mouse",
      easing: "easeInOutSine",
      opacity: 1,
      translateX: -95,
      duration: 1500
    },
    "-=1000"
  );
  tl.add(
    {
      targets: ".js_s .close",
      easing: "easeInOutSine",
      opacity: 1,
      duration: 100
    },
    "-=200"
  );
  tl.add({
    targets: ".js_s",
    easing: "easeInOutSine",
    translateY: -100,
    opacity: 0,
    duration: 1000
  });

  tl.add(
    {
      targets: ".mouse",
      easing: "easeInOutSine",
      translateX: -136,
      duration: 500
    },
    "-=300"
  );
  tl.add(
    {
      targets: ".js_j .close",
      easing: "easeInOutSine",
      opacity: 1,
      duration: 100
    },
    "-=200"
  );
  tl.add({
    targets: ".js_j",
    easing: "easeInOutSine",
    translateY: -100,
    opacity: 0,
    duration: 1000
  });
  tl.add({
    targets: ".mouse",
    easing: "easeInOutSine",
    translateX: 0,
    duration: 1000,
    opacity: 0
  });
  tl.add(
    {
      targets: ".close",
      opacity: 0,
      duration: 200
    },
    "-=200"
  );
  tl.add({
    targets: ".js_j",
    easing: "easeInOutSine",
    duration: 500,
    translateY: 0,
    opacity: 1
  });
  tl.add({
    targets: ".js_s",
    easing: "easeInOutSine",
    duration: 500,
    translateY: 0,
    opacity: 1
  });
  tl.add({
    targets: [".js_j", ".js_s"],
    borderColor: "#ffffff",
    duration: 1500
  });
});
