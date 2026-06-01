const SAVE_KEY = "merchantGame";

const state = {
    goods: [],
    cities: [],
    economy: [],
    transports: [],
    player: null,
    selectedCityId: null
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadGameData();

    state.player = loadPlayer();

    renderPlayerBar();
    renderMap();
    renderLog("Ваше торговое приключение начинается.");
}

async function loadGameData() {
    try {
        const [goods, cities, economy, transports] = await Promise.all([
            fetch("./goods.json").then(r => r.json()),
            fetch("./cities.json").then(r => r.json()),
            fetch("./economy.json").then(r => r.json()),
            fetch("./transports.json").then(r => r.json())
        ]);

        state.goods = goods;
        state.cities = cities;
        state.economy = economy;
        state.transports = transports;

    } catch (error) {
        console.error("Ошибка загрузки JSON:", error);
    }
}

function createDefaultPlayer() {
    return {
        version: 1,
        day: 1,
        gold: 100,
        cityId: 1,
        transportId: 1,
        inventory: [],
        statistics: {
            profit: 0,
            citiesVisited: [1]
        }
    };
}

function loadPlayer() {
    const save = localStorage.getItem(SAVE_KEY);

    if (!save) {
        const player = createDefaultPlayer();
        savePlayer(player);
        return player;
    }

    return JSON.parse(save);
}

function savePlayer(player = state.player) {
    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(player)
    );
}

function renderPlayerBar() {
    const city = getCity(state.player.cityId);
    const transport = getTransport(state.player.transportId);

    document.getElementById("player-day").textContent =
        state.player.day;

    document.getElementById("player-gold").textContent =
        `${state.player.gold} золотых`;

    document.getElementById("player-city").textContent =
        city?.name || "-";

    document.getElementById("player-transport").textContent =
        transport?.name || "-";

    document.getElementById("player-weight").textContent =
        `${getCurrentWeight()} / ${transport.capacity} кг`;
}

function renderMap() {
    const map = document.getElementById("world-map");

    map.innerHTML = "";

    state.cities.forEach(city => {

        const marker = document.createElement("div");

        marker.className = "city-marker";

        marker.style.left = `${city.x}%`;
        marker.style.top = `${city.y}%`;

        marker.title = city.name;

        marker.addEventListener("click", () => {
            selectCity(city.id);
        });

        map.appendChild(marker);

    });
}

function selectCity(cityId) {

    state.selectedCityId = cityId;

    const city = getCity(cityId);

    document.getElementById("city-name").textContent =
        city.name;

    document.getElementById("city-description").textContent =
        city.description || "Описание отсутствует.";

    highlightSelectedCity(cityId);
}

function highlightSelectedCity(cityId) {

    const markers =
        document.querySelectorAll(".city-marker");

    markers.forEach(marker => {
        marker.classList.remove("active");
    });

    const cityIndex =
        state.cities.findIndex(
            city => city.id === cityId
        );

    if (cityIndex >= 0) {
        markers[cityIndex].classList.add("active");
    }
}

function travelToSelectedCity() {

    if (!state.selectedCityId) {
        return;
    }

    if (
        state.selectedCityId ===
        state.player.cityId
    ) {
        return;
    }

    state.player.cityId =
        state.selectedCityId;

    state.player.day += 1;

    if (
        !state.player.statistics.citiesVisited.includes(
            state.selectedCityId
        )
    ) {
        state.player.statistics.citiesVisited.push(
            state.selectedCityId
        );
    }

    savePlayer();

    renderPlayerBar();

    renderLog(
        `Вы прибыли в ${
            getCity(
                state.selectedCityId
            ).name
        }.`
    );
}

function openMarket() {

    if (!state.selectedCityId) {
        return;
    }

    console.log(
        "Открыть рынок города:",
        state.selectedCityId
    );
}

function getCity(cityId) {
    return state.cities.find(
        city => city.id === cityId
    );
}

function getTransport(transportId) {
    return state.transports.find(
        transport =>
            transport.id === transportId
    );
}

function getCurrentWeight() {

    let weight = 0;

    state.player.inventory.forEach(item => {

        const good =
            state.goods.find(
                g => g.id === item.goodId
            );

        if (!good) {
            return;
        }

        weight +=
            good.weight *
            item.quantity;

    });

    return weight;
}

function renderLog(text) {

    const log =
        document.getElementById(
            "game-log"
        );

    const entry =
        document.createElement("div");

    entry.className = "log-entry";

    entry.textContent =
        `День ${state.player.day}. ${text}`;

    log.prepend(entry);
}

document.addEventListener(
    "click",
    event => {

        if (
            event.target.id ===
            "travel-button"
        ) {
            travelToSelectedCity();
        }

        if (
            event.target.id ===
            "market-button"
        ) {
            openMarket();
        }

    }
);