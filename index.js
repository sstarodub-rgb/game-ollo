const PLAYER_KEY = "merchantGame";

function getPlayer() {
  try {
    const data = localStorage.getItem(PLAYER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function createPlayer() {
  const names = [
    "Эйрик",
    "Торвин",
    "Гарет",
    "Мирон",
    "Лорик"
  ];

  const player = {
    name: names[Math.floor(Math.random() * names.length)],
    gold: 100,
    weight: 0,
    cityId: 1,
    transport: {
      name: "Осёл",
      capacity: 100
    }
  };

  localStorage.setItem(
    "merchantGame",
    JSON.stringify(player)
  );

  localStorage.setItem(
    "merchantLog",
    JSON.stringify([
      "Персонаж создан"
    ])
  );

  location.reload();
}

function renderCreateButton() {
  const game = document.getElementById("game");

  game.innerHTML = `
    <div class="create-player-wrapper">
      <button id="create-player-btn" class="create-player-btn">
        Создать торговца
      </button>
    </div>
  `;

  document
    .getElementById("create-player-btn")
    .addEventListener("click", createPlayer);
}

function bindButtons() {
  const marketButton = document.getElementById("market-button");
  const stableButton = document.getElementById("stable-button");
  const mapButton = document.getElementById("map-button");

  if (marketButton) {
    marketButton.addEventListener("click", () => {
      window.location.href = "./market.html";
    });
  }

  if (stableButton) {
    stableButton.addEventListener("click", () => {
      window.location.href = "./stable.html";
    });
  }

  if (mapButton) {
    mapButton.addEventListener("click", () => {
      window.location.href = "./map.html";
    });
  }
}

function initPage() {
  const player = getPlayer();

  if (!player) {
    renderCreateButton();
    return;
  }

  bindButtons();
}

initPage();