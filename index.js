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
   CITY
------------------------- */

function getCity(cityId) {
  const id = Number(cityId);

  const city = window.CITIES?.find(c => c.id === id) || null;

  return city;
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
    stats: { totalSpent: 0 },
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
   RENDER CITY
------------------------- */

function renderCity(player) {
  const city = getCity(player.cityId);
  const container = document.getElementById("city-container");

  if (!container || !city) return;

  container.innerHTML = `
    <section class="location-card city-card">
      
      <div class="location-icon">
        ${city.icon}
      </div>

      <div class="location-info">
        <h2 class="city-name">
          ${city.name}
        </h2>

        <div class="city-type">
          ${city.type}
        </div>

        <div class="city-description">
          ${city.description}
        </div>
      </div>

      <div class="city-coordinates">
        x: ${city.x} / y: ${city.y}
      </div>

    </section>
  `;
}

/* -------------------------
   RENDER BUTTONS
------------------------- */

function renderActions() {
  const container = document.getElementById("actions-container");

  if (!container) return;

  container.innerHTML = `
    <section class="actions-panel">
      <button id="market-button">Рынок</button>
      <button id="stable-button">Конюх</button>
      <button id="map-button">Карта</button>
    </section>
  `;

  document.getElementById("market-button").onclick = () => {
    window.location.href = "./market.html";
  };

  document.getElementById("stable-button").onclick = () => {
    window.location.href = "./stable.html";
  };

  document.getElementById("map-button").onclick = () => {
    window.location.href = "./map.html";
  };
}

/* -------------------------
   RENDER LOG
------------------------- */

function renderLog(player) {
  const container = document.getElementById("log-container");

  if (!container) return;

  container.innerHTML = `
    <section class="log-panel">
      <div class="log-title">Хроника путешествий</div>
      <div id="log-list"></div>
    </section>
  `;

  const list = container.querySelector("#log-list");

  player.log.slice(-20).forEach(item => {
    const div = document.createElement("div");
    const time = new Date(item.timestamp).toLocaleTimeString();

    div.className = "log-item";
    div.textContent = `[${time}] ${item.text}`;

    list.appendChild(div);
  });
}

/* -------------------------
   CREATE SCREEN
------------------------- */

function renderCreateScreen() {
  const game = document.getElementById("game");

  game.innerHTML = `
    <div class="create-player-wrapper">
      <button id="create-player-btn">Создать торговца</button>
    </div>
  `;

  document.getElementById("create-player-btn").onclick = createPlayer;
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
  renderActions();
  renderLog(player);
}

init();

alert("index.js END");