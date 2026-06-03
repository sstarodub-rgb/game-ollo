const player = getPlayer();

if (!player || !player.cityId) {
    alert("Ошибка: данные игрока не найдены!");
    window.location.href = 'index.html';
} else {
    initMarketPage();
}

// ====================== PLAYER ======================

function getPlayer() {
    const data = localStorage.getItem("merchantGame");
    return data ? JSON.parse(data) : null;
}

function savePlayer(player) {
    localStorage.setItem("merchantGame", JSON.stringify(player));
}

// ====================== INIT ======================

function initMarketPage() {

    const city = window.CITIES
        ? window.CITIES.find(c => c.id === player.cityId)
        : cities.find(c => c.id === player.cityId);

    if (city) {
        document.getElementById('market-city-name').textContent = city.name;
        document.getElementById('market-city-region').textContent = city.region || city.type || '';
        document.getElementById('market-city-icon').textContent = city.icon || '🏪';
    }

    updateInfoBar();
    renderMarketTable(city);

    document.getElementById('back-to-city-btn')
        .addEventListener('click', () => {
            window.location.href = 'index.html';
        });

    setupModal();
}

// ====================== INFO ======================

function updateInfoBar() {
    document.getElementById('player-gold').textContent = player.gold || 0;
    document.getElementById('player-weight').textContent = player.weight || 0;
    document.getElementById('transport-capacity').textContent =
        player.transport?.capacity || 100;
}

// ====================== PRICE ======================

function getCurrentPrice(good, type, city) {
    const base = good.basePrice || 10;
    const random = 0.9 + Math.random() * 0.2;
    let price = Math.round(base * random);
    return type === 'sell'
        ? Math.round(price * 0.8)
        : price;
}

// ====================== RENDER ======================

function renderMarketTable(city) {

    const tbody = document.getElementById('market-tbody');
    tbody.innerHTML = '';

    const inventoryMap = new Map(
        (player.inventory || []).map(i => [i.goodId, i.quantity])
    );

    window.GOODS.forEach(good => {

        const canBuy = city?.market?.buy?.includes(good.id) || false;
        const canSell = city?.market?.sell?.includes(good.id) || false;

        if (!canBuy && !canSell) return;

        const buyPrice = canBuy ? getCurrentPrice(good, 'buy', city) : null;
        const sellPrice = canSell ? getCurrentPrice(good, 'sell', city) : null;
        const inStock = inventoryMap.get(good.id) || 0;

        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="good-icon">${good.icon || '📦'}</td>
            <td>
                <strong>${good.name}</strong><br>
                <small>${good.categoryName || good.category || ''}</small>
            </td>
            <td class="text-center">
                ${canBuy
                    ? `<button class="fantasy-btn" data-id="${good.id}" data-mode="buy">${buyPrice} 💰</button>`
                    : '-'}
            </td>
            <td class="text-center">
                ${canSell && inStock > 0
                    ? `<button class="fantasy-btn" data-id="${good.id}" data-mode="sell">${sellPrice} 💰</button>`
                    : '—'}
            </td>
        `;

        tbody.appendChild(row);
    });

    // ====================== BUTTON DEBUG ======================

    const buttons = document.querySelectorAll('.fantasy-btn');

    console.log("BUTTONS FOUND:", buttons.length);

    buttons.forEach(btn => {

        btn.addEventListener('click', function () {

            console.log("CLICK DETECTED");

            const goodId = this.dataset.id;
            const mode = this.dataset.mode;

            console.log("DATA:", goodId, mode);

            try {
                openTradeModal(goodId, mode, city);
                console.log("openTradeModal OK");
            } catch (e) {
                console.error("ERROR openTradeModal:", e);
                alert("ERROR: " + e.message);
            }
        });
    });
}

// ====================== MODAL ======================

let currentGood = null;
let currentMode = null;
let currentPrice = 0;

function setupModal() {

    document.getElementById('modal-cancel')
        .addEventListener('click', closeModal);

    document.getElementById('modal-confirm')
        .addEventListener('click', confirmTrade);

    document.getElementById('qty-plus')
        .addEventListener('click', () => changeQuantity(1));

    document.getElementById('qty-minus')
        .addEventListener('click', () => changeQuantity(-1));
}

// ====================== OPEN MODAL ======================

function openTradeModal(goodId, mode, city) {

    console.log("OPEN MODAL:", goodId, mode);

    currentGood = window.GOODS.find(
        g => String(g.id) === String(goodId)
    );

    if (!currentGood) {
        console.log("GOOD NOT FOUND:", goodId);
        return;
    }

    currentMode = mode;
    currentPrice = getCurrentPrice(currentGood, mode, city);

    const available = mode === 'buy'
        ? 999
        : (player.inventory?.find(i => i.goodId == goodId)?.quantity || 0);

    document.getElementById('modal-title').textContent =
        mode === 'buy' ? 'Покупка' : 'Продажа';

    document.getElementById('modal-good-name').textContent =
        currentGood.name;

    document.getElementById('modal-price').textContent =
        currentPrice;

    document.getElementById('modal-available').textContent =
        available;

    document.getElementById('qty-value').textContent = 1;

    updateTotalPrice();

    document.getElementById('market-modal').style.display = 'flex';
}

// ====================== MODAL LOGIC ======================

function closeModal() {
    document.getElementById('market-modal').style.display = 'none';
}

function changeQuantity(delta) {

    let qty = parseInt(
        document.getElementById('qty-value').textContent
    );

    qty = Math.max(1, Math.min(999, qty + delta));

    document.getElementById('qty-value').textContent = qty;

    updateTotalPrice();
}

function updateTotalPrice() {

    const qty = parseInt(
        document.getElementById('qty-value').textContent
    );

    const total = qty * currentPrice;

    document.getElementById('modal-total').innerHTML =
        `Итого: <span class="highlight">${total}</span> монет`;
}

// ====================== TRADE ======================

function confirmTrade() {

    if (!currentGood) return;

    const qty = parseInt(
        document.getElementById('qty-value').textContent
    );

    if (currentMode === 'buy') {

        const totalCost = qty * currentPrice;

        if (player.gold < totalCost) {
            alert("Недостаточно золота!");
            return;
        }

        if ((player.weight || 0) + qty * currentGood.weight >
            (player.transport?.capacity || 100)) {
            alert("Слишком тяжело!");
            return;
        }

        player.gold -= totalCost;
        player.weight = (player.weight || 0) + qty * currentGood.weight;

        const existing = player.inventory.find(
            i => i.goodId == currentGood.id
        );

        if (existing) {
            existing.quantity += qty;
        } else {
            player.inventory.push({
                goodId: currentGood.id,
                quantity: qty
            });
        }

        alert(`Куплено ${qty} × ${currentGood.name}`);

    } else {

        const totalEarn = qty * currentPrice;

        const index = player.inventory.findIndex(
            i => i.goodId == currentGood.id
        );

        if (index === -1 ||
            player.inventory[index].quantity < qty) {
            alert("Недостаточно товара!");
            return;
        }

        player.inventory[index].quantity -= qty;

        if (player.inventory[index].quantity <= 0) {
            player.inventory.splice(index, 1);
        }

        player.gold += totalEarn;

        player.weight = Math.max(
            0,
            player.weight - qty * currentGood.weight
        );

        alert(`Продано ${qty} × ${currentGood.name}`);
    }

    savePlayer(player);

    closeModal();

    renderMarketTable(
        window.CITIES
            ? window.CITIES.find(c => c.id === player.cityId)
            : null
    );

    updateInfoBar();
}