const SAVE_KEY = "merchantGame";

function getPlayer() {
    let data = localStorage.getItem(SAVE_KEY);

    if (!data) {
        const newPlayer = createPlayer();
        localStorage.setItem(SAVE_KEY, JSON.stringify(newPlayer));
        return newPlayer;
    }

    return JSON.parse(data);
}

function createPlayer() {
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
    const names = [
        "Эйрик",
        "Торвин",
        "Гарет",
        "Мирон",
        "Лорик",
        "Далвин"
    ];

    return names[Math.floor(Math.random() * names.length)];
}

function renderHeader() {
    const player = getPlayer();

    const header = document.createElement("div");
    header.className = "game-header";

    header.innerHTML = `
        <div class="hud">
            <span class="hud-name">${player.name}</span>
            <span class="hud-gold">💰 ${player.gold}</span>
            <span class="hud-transport">🐴 ${player.transport.name}</span>
            <span class="hud-weight">⚖ ${player.weight}/${player.transport.capacity}</span>
        </div>
    `;

    document.body.prepend(header);
}

document.addEventListener("DOMContentLoaded", renderHeader);