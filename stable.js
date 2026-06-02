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
    transports = await res.json();
  } catch (e) {
    console.error("TRANSPORT LOAD ERROR", e);
    return;
  }

  renderTransport();

  document.getElementById("test-btn").onclick = () => {
    alert("Конюх работает");
  };
}

function renderTransport() {
  const container = document.getElementById("transport-list");

  container.innerHTML = "";

  transports.forEach(t => {
    const div = document.createElement("div");

    const isCurrent = player.transport?.name === t.name;

    div.innerHTML = `
      <div>
        🐴 ${t.name}
      </div>

      <div>
        ⚖ ${t.capacity}
      </div>

      <div>
        🚀 ${t.speed}
      </div>

      <button ${isCurrent ? "disabled" : ""} data-id="${t.id}">
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