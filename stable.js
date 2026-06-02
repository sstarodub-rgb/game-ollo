let transports = [];
let player = null;

alert("СТРАНИЦА КОНЮХА РАБОТАЕТ");

document.addEventListener("DOMContentLoaded", init);

async function init() {
  const playerData = localStorage.getItem("merchantGame");

  if (!playerData) {
    alert("Нет игрока");
    return;
  }

  player = JSON.parse(playerData);

  try {
    const res = await fetch("./transport.json?v=" + Date.now());

    if (!res.ok) {
      throw new Error("transport.json not found");
    }

    transports = await res.json();
  } catch (e) {
    console.error("TRANSPORT LOAD ERROR:", e);
    return;
  }

  renderTransport();

  const btn = document.getElementById("test-btn");

  if (btn) {
    btn.onclick = () => {
      alert("Конюх работает");
    };
  }
}

function renderTransport() {
  const container = document.getElementById("transport-list");

  if (!container) return;

  container.innerHTML = "";

  transports.forEach(t => {
    const div = document.createElement("div");

    const isCurrent =
      player.transport && player.transport.name === t.name;

    div.innerHTML = `
      <div>🐴 ${t.name}</div>
      <div>⚖ ${t.capacity}</div>
      <div>🚀 ${t.speed}</div>
      <button ${isCurrent ? "disabled" : ""}>
        ${isCurrent ? "Текущий" : "Выбрать"}
      </button>
    `;

    div.querySelector("button").onclick = () => {
      selectTransport(t);
    };

    container.appendChild(div);
  });
}

function selectTransport(t) {
  player.transport = {
    name: t.name,
    capacity: t.capacity
  };

  localStorage.setItem("merchantGame", JSON.stringify(player));

  alert("Транспорт обновлён: " + t.name);

  renderTransport();
}