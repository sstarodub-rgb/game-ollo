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
  return window.CITIES?.find(c => c.id === id) || null;
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
   CITY RENDER
------------------------- */

function renderCity(player) {
  const city = getCity(player.cityId);
  const container = document.getElementById("city-container");

  if (!container || !city) return;

  container.innerHTML = `
   <section class="location-card city-card">

  <!-- 1. HEADER -->
  <div class="city-header">
    
    <div class="city-icon">
      ${city.icon}
    </div>

    <div class="city-title-block">
      <h2 class="city-name">
        <span class="city-name-first">${city.name[0]}</span>${city.name.slice(1)}
      </h2>

      <div class="city-type">
        ${city.type}
      </div>
    </div>

  </div>

  <!-- 2. DESCRIPTION -->
  <div class="city-description">
    ${city.description}
  </div>

  <!-- 3. COORDS -->
  <div class="city-coordinates">
    x: ${city.x} / y: ${city.y}
  </div>

</section>
  `;
}

/* -------------------------
   LOG
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
      <button class="create-player-btn" id="create-player-btn">Создать торговца</button>
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
  renderLog(player);
}

init();