alert("index.js START");

const PLAYER_KEY = "merchantGame";

/* -------------------------
   STORAGE
------------------------- */

function getPlayer() {
  try {
    const data = localStorage.getItem(PLAYER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function savePlayer(player) {
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

/* -------------------------
   CREATE PLAYER
------------------------- */

function createPlayer() {
  const names = ["Эйрик", "Торвин", "Гарет", "Мирон", "Лорик"];

  const player = {
    name: names[Math.floor(Math.random() * names.length)],
    gold: 100,
    weight: 0,
    cityId: 1,

    transport: {
      id: 1,
      name: "Осёл",
      capacity: 100,
      speed: 1.0
    },

    inventory: [],
    stats: {
      totalSpent: 0
    },

    log: [
      {
        text: "Персонаж создан",
        cityId: 1,
        timestamp: Date.now()
      }
    ]
  };

  savePlayer(player);
  location.reload();
}

/* -------------------------
   LOG
------------------------- */

function addLog(player, text) {
  player.log.push({
    text,
    cityId: player.cityId,
    timestamp: Date.now()
  });

  savePlayer(player);
}

/* -------------------------
   CITY RENDER
------------------------- */

function getCity(player) {
  if (!window.CITIES) return null;
  return CITIES.find(c => c.id === player.cityId);
}

function renderCity(player) {
  const city = getCity(player);
  if (!city) return;

  const icon = document.getElementById("city-icon");
  const name = document.getElementById("player-city-name");
  const type = document.getElementById("city-type");

  if (icon) icon.textContent = city.icon;
  if (name) name.textContent = city.name;
  if (type) type.textContent = city.type;
}

/* -------------------------
   LOG RENDER
------------------------- */

function renderLog(player) {
  const container = document.getElementById("log-list");
  if (!container) return;

  container.innerHTML = "";

  player.log.slice(-20).forEach(item => {
    const div = document.createElement("div");

    const time = new Date(item.timestamp).toLocaleTimeString();

    div.className = "log-item";
    div.textContent = `[${time}] ${item.text}`;

    container.appendChild(div);
  });
}

/* -------------------------
   BUTTONS
------------------------- */

function bindButtons(player) {
  const market = document.getElementById("market-button");
  const stable = document.getElementById("stable-button");
  const map = document.getElementById("map-button");

  if (market) {
    market.onclick = () => {
      window.location.href = "./market.html";
    };
  }

  if (stable) {
    stable.onclick = () => {
      window.location.href = "./stable.html";
    };
  }

  if (map) {
    map.onclick = () => {
      window.location.href = "./map.html";
    };
  }
}

/* -------------------------
   CREATE SCREEN
------------------------- */

function renderCreateScreen() {
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

/* -------------------------
   INIT
------------------------- */

function init() {
  const player = getPlayer();

  if (!player) {
    renderCreateScreen();
    return;
  }

  renderCity(player);
  renderLog(player);
  bindButtons(player);
}

document.addEventListener("DOMContentLoaded", init);

alert("index.js END");