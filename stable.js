document.addEventListener("DOMContentLoaded", () => {
  setupBackButton();
  renderTransports();
});

function setupBackButton() {
  const btn = document.getElementById("back-to-city-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      window.location.href = "./index.html";
    });
  }
}

function getPlayer() {
  const data = localStorage.getItem("merchantGame");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

function savePlayer(player) {
  localStorage.setItem("merchantGame", JSON.stringify(player));
}

function renderTransports() {
  const container = document.getElementById("transport-list");
  if (!container) return;

  const player = getPlayer();
  if (!player) {
    container.innerHTML = `<div style="padding:10px; color:#c89b3c;">Сначала создайте персонажа в меню игры.</div>`;
    return;
  }

  // Гарантируем, что золото существует
  if (player.gold === undefined) player.gold = 0;

  container.innerHTML = "";

  if (typeof window.TRANSPORTS === "undefined") {
    container.innerHTML = "<div>Ошибка: список транспорта не загружен.</div>";
    return;
  }

  window.TRANSPORTS.forEach(t => {
    const isOwned = player.transport && player.transport.id === t.id;
    const canBuy = player.gold >= t.price;

    const card = document.createElement("div");
    card.className = "transport-card";

    card.innerHTML = `
      <h3>${t.name}</h3>
      <p>⚖️ Вместимость: ${t.capacity}</p>
      <p>🚀 Скорость: ${t.speed}</p>
      <p>💰 Цена: ${t.price > 0 ? t.price : "Бесплатно"}</p>
      <p>${t.description}</p>
      <button class="buy-btn" ${isOwned ? "disabled" : ""}>
        ${isOwned ? "Используется" : (canBuy ? "Купить / Выбрать" : "Недостаточно золота")}
      </button>
    `;

    if (!isOwned) {
      card.querySelector(".buy-btn").addEventListener("click", () => {
        buyTransport(t);
      });
    }

    container.appendChild(card);
  });
}

function buyTransport(t) {
  let player = getPlayer();
  if (!player) return;

  if (player.gold < t.price) {
    alert("Недостаточно золота!");
    return;
  }

  // Вычитаем цену и меняем транспорт
  player.gold -= t.price;
  player.transport = {
    id: t.id,
    name: t.name,
    capacity: t.capacity,
    speed: t.speed
  };

  savePlayer(player);
  alert(`Вы приобрели ${t.name}!`);
  renderTransports(); // Обновляем список на экране
}
