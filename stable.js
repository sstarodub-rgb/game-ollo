let player = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
  setupBackButton();
  loadPlayer();
  renderTransports();
}

function setupBackButton() {
  const btn = document.getElementById("back-to-city-btn");

  btn.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
}

function loadPlayer() {
  const data = localStorage.getItem("merchantGame");

  if (!data) {
    alert("Нет игрока");
    return;
  }

  player = JSON.parse(data);
}

function savePlayer() {
  localStorage.setItem("merchantGame", JSON.stringify(player));
}

function renderTransports() {
  const container = document.getElementById("transport-list");
  container.innerHTML = "";

  TRANSPORTS.forEach(t => {
    const isOwned = player.transport?.name === t.name;
    const canBuy = player.gold >= t.price;

    const card = document.createElement("div");
    card.className = "transport-card";

    card.innerHTML = `
      <h3>${t.name}</h3>
      <p>⚖️ ${t.capacity}</p>
      <p>🚀 ${t.speed}</p>
      <p>💰 ${t.price}</p>
      <p>${t.description}</p>
      <button ${isOwned ? "disabled" : ""}>
        ${isOwned ? "Используется" : canBuy ? "Купить / выбрать" : "Нет денег"}
      </button>
    `;

    card.querySelector("button").onclick = () => {
      buyTransport(t);
    };

    container.appendChild(card);
  });
}

function buyTransport(t) {
  if (player.gold < t.price) {
    alert("Недостаточно золота");
    return;
  }

  player.gold -= t.price;

  player.transport = {
    name: t.name,
    capacity: t.capacity,
    speed: t.speed
  };

  savePlayer();
  renderTransports();
}