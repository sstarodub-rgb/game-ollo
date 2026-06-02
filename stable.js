let player = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
  setupBackButton();
  loadPlayer();

  if (!player) {
    renderEmptyState();
    return;
  }

  renderTransports();
}

function setupBackButton() {
  const btn = document.getElementById("back-to-city-btn");

  if (!btn) return;

  btn.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
}

function loadPlayer() {
  try {
    const data = localStorage.getItem("merchantGame");

    if (!data) {
      player = null;
      return;
    }

    player = JSON.parse(data);

    // защита от кривого state
    if (!player || typeof player !== "object") {
      player = null;
    }

  } catch (e) {
    console.error("Player load error:", e);
    player = null;
  }
}

function savePlayer() {
  localStorage.setItem("merchantGame", JSON.stringify(player));
}

function renderEmptyState() {
  const container = document.getElementById("transport-list");

  if (!container) return;

  container.innerHTML = `
    <div style="padding:10px; color: #c89b3c;">
      Нет игрока. Создай персонажа в главном меню.
    </div>
  `;
}

function renderTransports() {
  const container = document.getElementById("transport-list");

  if (!container) return;

  container.innerHTML = "";

  if (!window.TRANSPORTS || !Array.isArray(TRANSPORTS)) {
    container.innerHTML = "<div>TRANSPORTS не загружен</div>";
    return;
  }

  TRANSPORTS.forEach(t => {
    const isOwned = player?.transport?.id === t.id;
    const canBuy = player.gold >= t.price;

    const card = document.createElement("div");
    card.className = "transport-card";

    card.innerHTML = `
      <h3>${t.name}</h3>
      <p>⚖️ Вместимость: ${t.capacity}</p>
      <p>🚀 Скорость: ${t.speed}</p>
      <p>💰 Цена: ${t.price}</p>
      <p>${t.description}</p>

      <button ${isOwned ? "disabled" : ""}>
        ${isOwned ? "Используется" : canBuy ? "Купить / выбрать" : "Нет денег"}
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      buyTransport(t);
    });

    container.appendChild(card);
  });
}

function buyTransport(t) {
  if (!player) return;

  if (player.gold < t.price) {
    alert("Недостаточно золота");
    return;
  }

  player.gold -= t.price;

  player.transport = {
    id: t.id,
    name: t.name,
    capacity: t.capacity,
    speed: t.speed
  };

  savePlayer();
  renderTransports();
}