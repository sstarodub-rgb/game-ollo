alert("1. market.js загружен");

const player = getPlayer();

alert("2. getPlayer() выполнен");

if (!player || !player.cityId) {
    alert("3. Ошибка: данные игрока не найдены");
    window.location.href = 'index.html';
} else {
    alert("4. Игрок найден, запускаем initMarketPage()");
    initMarketPage();
}

// ====================== ОСНОВНЫЕ ФУНКЦИИ ======================

function getPlayer() {
    alert("getPlayer(): читаем localStorage");

    const data = localStorage.getItem("merchantGame");

    alert("getPlayer(): данные = " + (data ? "есть" : "нет"));

    try {
        return data ? JSON.parse(data) : null;
    } catch (e) {
        alert("Ошибка JSON.parse:\n" + e.message);
        return null;
    }
}

function savePlayer(player) {
    localStorage.setItem("merchantGame", JSON.stringify(player));
}

function initMarketPage() {

    alert("5. initMarketPage() старт");

    let city;

    try {

        alert(
            "6. Проверка данных\n" +
            "window.CITIES = " + typeof window.CITIES +
            "\nwindow.GOODS = " + typeof window.GOODS
        );

        city = window.CITIES
            ? window.CITIES.find(c => c.id === player.cityId)
            : cities.find(c => c.id === player.cityId);

        alert("7. Поиск города завершён");

    } catch (e) {
        alert("ОШИБКА ПРИ ПОИСКЕ ГОРОДА:\n\n" + e.message);
        throw e;
    }

    try {

        if (city) {

            alert("8. Город найден: " + city.name);

            document.getElementById('market-city-name').textContent = city.name;
            document.getElementById('market-city-region').textContent =
                city.region || city.type || '';

            document.getElementById('market-city-icon').textContent =
                city.icon || '🏪';

            alert("9. Карточка города заполнена");

        } else {
            alert("8. Город НЕ найден");
        }

    } catch (e) {
        alert("ОШИБКА ПРИ ЗАПОЛНЕНИИ ГОРОДА:\n\n" + e.message);
        throw e;
    }

    try {
        updateInfoBar();
        alert("10. updateInfoBar() выполнен");
    } catch (e) {
        alert("ОШИБКА updateInfoBar:\n\n" + e.message);
        throw e;
    }

    try {
        renderMarketTable(city);
        alert("11. renderMarketTable() выполнен");
    } catch (e) {
        alert("ОШИБКА renderMarketTable:\n\n" + e.message);
        throw e;
    }

    try {

        const backBtn = document.getElementById('back-to-city-btn');

        alert(
            "12. Кнопка назад = " +
            (backBtn ? "найдена" : "НЕ найдена")
        );

        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

    } catch (e) {
        alert("ОШИБКА КНОПКИ НАЗАД:\n\n" + e.message);
        throw e;
    }

    try {
        setupModal();
        alert("13. setupModal() выполнен");
    } catch (e) {
        alert("ОШИБКА setupModal:\n\n" + e.message);
        throw e;
    }

    alert("14. initMarketPage завершён");
}

// ====================== ИНФО И ТАБЛИЦА ======================

function updateInfoBar() {

    alert("updateInfoBar() старт");

    document.getElementById('player-gold').textContent =
        player.gold || 0;

    document.getElementById('player-weight').textContent =
        player.weight || 0;

    document.getElementById('transport-capacity').textContent =
        player.transport?.capacity || 100;
}

function getCurrentPrice(good, type, city) {
    const base = good.basePrice || 10;
    const random = 0.9 + Math.random() * 0.2;
    let price = Math.round(base * random);
    return type === 'sell' ? Math.round(price * 0.8) : price;
}

function renderMarketTable(city) {

    alert("renderMarketTable() старт");

    const tbody = document.getElementById('market-tbody');

    alert(
        "market-tbody = " +
        (tbody ? "найден" : "НЕ найден")
    );

    if (!tbody) {
        return;
    }

    tbody.innerHTML = '';

    alert(
        "window.GOODS = " +
        (window.GOODS ? window.GOODS.length : "undefined")
    );

    const inventoryMap =
        new Map((player.inventory || [])
            .map(item => [item.goodId, item.quantity]));

    alert("inventoryMap создан");

    window.GOODS.forEach(good => {

        const canBuy =
            city?.market?.buy?.includes(good.id) || false;

        const canSell =
            city?.market?.sell?.includes(good.id) || false;

        if (!canBuy && !canSell) return;

        const buyPrice =
            canBuy ? getCurrentPrice(good, 'buy', city) : null;

        const sellPrice =
            canSell ? getCurrentPrice(good, 'sell', city) : null;

        const inStock =
            inventoryMap.get(good.id) || 0;

        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="good-icon">${good.icon || '📦'}</td>
            <td>
                <strong>${good.name}</strong><br>
                <small>${good.categoryName || good.category || ''}</small>
            </td>
            <td class="text-center">
                ${canBuy
                    ? `<button class="btn-buy fantasy-btn" data-id="${good.id}" data-mode="buy">${buyPrice} 💰</button>`
                    : '-'}
            </td>
            <td class="text-center">
                ${canSell && inStock > 0
                    ? `<button class="btn-sell fantasy-btn" data-id="${good.id}" data-mode="sell">${sellPrice} 💰</button>`
                    : '—'}
            </td>
        `;

        tbody.appendChild(row);
    });

    alert("Товары отрисованы");

    document.querySelectorAll('.fantasy-btn').forEach(btn => {

        btn.addEventListener('click', function() {

            const goodId =
                parseInt(this.dataset.id);

            const mode =
                this.dataset.mode;

            openTradeModal(goodId, mode, city);
        });

    });

    alert("Кнопки подключены");
}

// ====================== МОДАЛКА ======================

let currentGood = null;
let currentMode = null;
let currentPrice = 0;

function setupModal() {

    alert("setupModal() старт");

    document.getElementById('modal-cancel')
        .addEventListener('click', closeModal);

    document.getElementById('modal-confirm')
        .addEventListener('click', confirmTrade);

    document.getElementById('qty-plus')
        .addEventListener('click', () => changeQuantity(1));

    document.getElementById('qty-minus')
        .addEventListener('click', () => changeQuantity(-1));

    alert("setupModal() конец");
}