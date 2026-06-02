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
   CITY
------------------------- */

function getCityById(cityId) {
  if (!window.CITIES) return null;
  return CITIES.find(c => c.id === cityId);
}

function renderCity(player) {
  const city = getCityById(player.cityId);
  if (!city) return;

  const iconEl = document.getElementById("city-icon");
  const nameEl = document.getElementById("player-city-name");
  const typeEl = document.getElementById("city-type");

  if (iconEl) iconEl.textContent = city.icon || "";
  if (nameEl) nameEl.textContent = city.name || "";
  if (typeEl) typeEl.textContent = city.type || "";
}

/* -------------------------
   LOG RENDER
------------------------- */

function renderLog(player) {
  const container = document.getElementById("log-list");
  if (!container) return;

  container.innerHTML = "";

  const lastLogs = player.log.slice(-20);

  lastLogs.forEach(item => {
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

function bindButtons() {
  const marketBtn = document.getElementById("market-button");
  const stableBtn = document.getElementById("stable-button");
  const mapBtn = document.getElementById("map-button");

  if (marketBtn) {
    marketBtn.onclick = () => {
      window.location.href = "./market.html";
    };
  }

  if (stableBtn) {
    stableBtn.onclick = () => {
      window.location.href = "./stable.html";
    };
  }

  if (mapBtn) {
    mapBtn.onclick = () => {
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
  bindButtons();
}

document.addEventListener("DOMContentLoaded", init);

alert("index.js END");