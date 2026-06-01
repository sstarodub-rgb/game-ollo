const SAVE_KEY = "merchantGame";

function getPlayer() {
    const data = localStorage.getItem(SAVE_KEY);
    return data ? JSON.parse(data) : null;
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

        document.getElementById("reset-game")
            .addEventListener("click", resetGame);

        return;
    }

    header.innerHTML = `
        <div class="hud">
            <span class="hud-name">
                👤 ${player.name}
            </span>

            <span class="hud-gold">
                💰 ${player.gold}
            </span>

            <span class="hud-transport">
                🐴 ${player.transport.name}
            </span>

            <span class="hud-weight">
                ⚖ ${player.weight}/${player.transport.capacity}
            </span>
        </div>
    `;

    document.body.prepend(header);
}

document.addEventListener("DOMContentLoaded", renderHeader);