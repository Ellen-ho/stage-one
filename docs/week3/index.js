const verticalMenu = document.querySelector("#vertical-menu");
const burgerIcon = document.querySelector("#burger-icon");
const closeBtn = document.querySelector(".close-btn");
const loadBtn = document.querySelector(".load-btn");
const wrapper = document.querySelector(".wrapper");
let dataAfterFetch = null;

function fetchData() {
  const url =
    "https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1";
  fetch(url)
    .then((resp) => resp.json())
    .then((resp) => {
      dataAfterFetch = resp.data;
      if (dataAfterFetch.results.length > 0) {
        loadBtn.style.display = "block";
      }
      renderSpots(dataAfterFetch);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderSpots(dataAfterFetch) {
  renderSmallBoxesSpots(dataAfterFetch);
  renderBigBoxesSpots(dataAfterFetch);
}

function renderSmallBoxesSpots(dataAfterFetch) {
  const smallBoxesContainer = document.querySelector(".small-boxes");
  for (let i = 0; i < 3; i++) {
    let spot = dataAfterFetch.results[i];
    const box = createSpotBox(spot, true);
    smallBoxesContainer.appendChild(box);
  }
}

let bigBoxSpotStartIndex = 3;

function renderBigBoxesSpots(dataAfterFetch) {
  const bigBoxesContainer = document.createElement("div");
  bigBoxesContainer.classList.add("big-boxes");
  const nextRoundBigBoxSpotIndex = bigBoxSpotStartIndex + 10;
  for (
    let i = bigBoxSpotStartIndex;
    i < nextRoundBigBoxSpotIndex && i < dataAfterFetch.results.length;
    i++
  ) {
    let spot = dataAfterFetch.results[i];
    const box = createSpotBox(spot, false);
    bigBoxesContainer.appendChild(box);
  }
  wrapper.appendChild(bigBoxesContainer);
  bigBoxSpotStartIndex = nextRoundBigBoxSpotIndex;
}

function findFirstHttpsUrl(filelist) {
  const regex = /https:\/\/[^\s]+?(?=\s*https:\/\/|$)/;

  const matches = filelist.match(regex);

  if (matches && matches.length > 0) {
    return matches[0];
  } else {
    return null;
  }
}

function createSpotBox(spot, isSmall) {
  const box = document.createElement("div");
  box.className = "box";

  const image = document.createElement("img");
  const imageUrl = findFirstHttpsUrl(spot.filelist);
  const imageUrlWithLowerCase = imageUrl.replace(/\.(jpeg|jpg)/gi, ".jpg");

  image.src = imageUrlWithLowerCase;
  image.alt = spot.stitle;

  const icon = document.createElement("img");
  icon.src = "./assets/star.png";
  icon.alt = "Icon";

  const title = document.createElement("p");
  title.textContent = spot.stitle;
  title.title = spot.stitle;

  box.appendChild(image);
  box.appendChild(title);

  if (!isSmall) {
    box.style.backgroundImage = `url(${image.src})`;
    box.appendChild(icon);
    box.removeChild(image);
  }

  return box;
}

function addEventListeners() {
  burgerIcon.addEventListener("click", function () {
    verticalMenu.style.display = "flex";
  });

  closeBtn.addEventListener("click", function () {
    verticalMenu.style.display = "none";
  });

  loadBtn.addEventListener("click", function () {
    if (
      dataAfterFetch &&
      dataAfterFetch.results.length >= bigBoxSpotStartIndex
    ) {
      renderBigBoxesSpots(dataAfterFetch);
    }
    if (dataAfterFetch.results.length < bigBoxSpotStartIndex) {
      loadBtn.textContent = "No More Data";
      loadBtn.style.cursor = "unset";
    }
  });
}

function init() {
  addEventListeners();
  fetchData();
}

window.onload = init;
