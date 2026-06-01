alert("HEADER.JS ЗАГРУЖЕН");

const SAVE_KEY = "merchantGame";

function getPlayer() {
    try {
        const data = localStorage.getItem(SAVE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        alert("ОШИБКА LOCALSTORAGE");
        return null;
    }
}

function createDefaultPlayer() {
    return {
        name: generateName(),
        gold: 100,
        day: 1,
        cityId: 1,
        transport: {
            name: "Осёл",
            capacity: 100
        },
        weight: 0
    };
}

function generateName() {
    const names = ["Эйрик", "Торвин", "Гарет", "Мирон", "Лорик"];
    return names[Math.floor(Math.random() * names.length)];
}

function savePlayer(player) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
}

function resetGame() {
    const player = createDefaultPlayer();
    savePlayer(player);
    location.reload();
}

function renderHeader() {
    alert("RENDER HEADER START");

    const player = getPlayer();

    const header = document.createElement("div");
    header.className = "game-header";

    if (!player) {
        header.innerHTML = `
            <button class="reset-btn" id="reset-game">
                🔄 Reset Game
            </button>
        `;

        document.body.prepend(header);

        const btn = document.getElementById("reset-game");
        if (btn) {
            btn.addEventListener("click", resetGame);
        }

        alert("NO PLAYER - RESET MODE");
        return;
    }

    header.innerHTML = `
        <div class="hud">
            <span>👤 ${player.name}</span>
            <span>💰 ${player.gold}</span>
            <span>🐴 ${player.transport.name}</span>
            <span>⚖ ${player.weight}/${player.transport.capacity}</span>
        </div>
    `;

    document.body.prepend(header);

    alert("HEADER RENDERED");
}

/* безопасный запуск */
(function boot() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderHeader);
    } else {
        renderHeader();
    }
})();