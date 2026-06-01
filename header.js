const SAVE_KEY = "merchantGame";

function getPlayer() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function createDefaultPlayer() {
  const names = ["Эйрик", "Торвин", "Гарет", "Мирон", "Лорик"];

  return {
    name: names[Math.floor(Math.random() * names.length)],
    gold: 100,
    cityId: 1,
    weight: 0,
    transport: {
      name: "Осёл",
      capacity: 100
    }
  };
}

function savePlayer(player) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(player));
}

function createNewGame() {
  const player = createDefaultPlayer();
  savePlayer(player);
  location.reload();
}

function renderHeader() {
  const oldHeader = document.getElementById("game-header");

  if (oldHeader) {
    oldHeader.remove();
  }

  const player = getPlayer();

  const header = document.createElement("header");
  header.id = "game-header";

  if (!player) {
    header.innerHTML = `
      <button id="reset-game-btn" class="header-reset-btn">
        🔄
      </button>
    `;

    document.body.prepend(header);

    document
      .getElementById("reset-game-btn")
      .addEventListener("click", createNewGame);

    return;
  }

  header.innerHTML = `
    <div class="header-info">
      <span>👤 ${player.name}</span>
      <span>💰 ${player.gold}</span>
      <span>🐴 ${player.transport.name}</span>
      <span>⚖ ${player.weight}/${player.transport.capacity}</span>
    </div>
  `;

  document.body.prepend(header);
}

renderHeader();