const tab = document.querySelectorAll(".operation-tab");
const tabscontainer = document.querySelector(".operation-tab-container");
const tabcontent = document.querySelectorAll(".operation-content");
tabscontainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operation-tab");
  if (!clicked) return;

  tab.forEach((t) => t.classList.remove("operation-tab-active"));
  tabcontent.forEach((t) => t.classList.remove("operation-content-active"));
  clicked.classList.add("operation-tab-active");
  document
    .querySelector(`.operation-content-${clicked.dataset.tab}`)
    .classList.add("operation-content-active");
});
