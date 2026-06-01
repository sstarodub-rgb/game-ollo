const STORAGE_KEYS = {
  PLAYER: "merchantGame"
};

function getPlayer() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function isValidPlayer(player) {
  return (
    player &&
    typeof player.name === "string" &&
    typeof player.gold === "number" &&
    typeof player.weight === "number" &&
    player.transport &&
    typeof player.transport.name === "string" &&
    typeof player.transport.capacity === "number"
  );
}

function resetStorage() {
  localStorage.clear();
  location.reload();
}

function renderResetHeader() {
  const header = document.createElement("header");
  header.id = "game-header";

  header.innerHTML = `
    <div class="header-reset">
      <button id="reset-storage-btn" class="header-delete-btn">
        🗑 Очистить данные
      </button>
    </div>
  `;

  document.body.prepend(header);

  document
    .getElementById("reset-storage-btn")
    .addEventListener("click", resetStorage);
}

function renderPlayerHeader(player) {
  const header = document.createElement("header");
  header.id = "game-header";

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

function renderHeader() {
  const player = getPlayer();

  if (!isValidPlayer(player)) {
    renderResetHeader();
    return;
  }

  renderPlayerHeader(player);
}

renderHeader();