const SAVE_KEY = "merchantGame";

function getPlayer() {
  const data = localStorage.getItem(SAVE_KEY);
  return data ? JSON.parse(data) : null;
}

function createPlayer() {
  const names = ["Эйрик", "Торвин", "Гарет", "Мирон", "Лорик"];

  return {
    name: names[Math.floor(Math.random() * names.length)],
    gold: 100,
    day: 1,
    transport: { name: "Осёл", capacity: 100 },
    weight: 0
  };
}

function savePlayer(p) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(p));
}

function resetGame() {
  savePlayer(createPlayer());
  location.reload();
}

function renderHeader() {
  const player = getPlayer();

  const el = document.createElement("div");
  el.className = "game-header";

  if (!player) {
    el.innerHTML = `<button id="reset">🔄 Reset</button>`;
    document.body.insertBefore(el, document.body.firstChild);
    document.getElementById("reset").onclick = resetGame;
    return;
  }

  el.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;display:flex;gap:8px;font-size:12px;color:#fff;background:#222;padding:6px;z-index:9999">
      <span>👤 ${player.name}</span>
      <span>💰 ${player.gold}</span>
      <span>🐴 ${player.transport.name}</span>
      <span>⚖ ${player.weight}/${player.transport.capacity}</span>
    </div>
  `;

  document.body.insertBefore(el, document.body.firstChild);
}

renderHeader();