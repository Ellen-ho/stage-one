function init() {
  const verticalMenu = document.querySelector("#vertical-menu");
  const burgerIcon = document.querySelector("#burger-icon");
  const closeBtn = document.querySelector(".close-btn");

  burgerIcon.addEventListener("click", function () {
    verticalMenu.style.display = "flex";
  });

  closeBtn.addEventListener("click", function () {
    verticalMenu.style.display = "none";
  });
}

window.onload = init;
