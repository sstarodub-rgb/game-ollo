const player = getPlayer();
let marketPrices = {};
let currentGood = null;
let currentMode = null;
let currentPrice = 0;

if (!player || !player.cityId) {
    alert("Ошибка: данные игрока не найдены!");
    window.location.href = 'index.html';
} else {
    initMarketPage();
}

function getPlayer() {
    const data = localStorage.getItem("merchantGame");
    return data ? JSON.parse(data) : null;
}

function savePlayer(player) {
    localStorage.setItem("merchantGame", JSON.stringify(player));
}

/**
 * Логика лимитов согласно ТЗ
 */
function getLimits(price) {
    if (price > 400) return { min: 2, max: 5 };
    if (price > 100) return { min: 5, max: 12 };
    return { min: 20, max: 50 };
}

function initMarketPage() {
    const city = window.CITIES
        ? window.CITIES.find(c => c.id === player.cityId)
        : cities.find(c => c.id === player.cityId);

    marketPrices = {};
    window.GOODS.forEach(good => {
        marketPrices[good.id] = {
            buy: getCurrentPrice(good, 'buy', city),
            sell: getCurrentPrice(good, 'sell', city)
        };
    });

    renderMarketTable(city);

    document.getElementById('back-to-city-btn')
        .addEventListener('click', () => {
            window.location.href = 'index.html';
        });

    setupModal();
}

function getCurrentPrice(good, type, city) {
    const base = good.basePrice || 10;
    const random = 0.9 + Math.random() * 0.2;
    let price = base * random;

    if (type === 'buy' && city?.market?.buy?.includes(good.id)) price *= 0.9;
    if (type === 'sell' && city?.market?.sell?.includes(good.id)) price *= 1.15;

    price = Math.round(price);
    return type === 'sell' ? Math.round(price * 0.8) : price;
}

function renderMarketTable(city) {
    const tbody = document.getElementById('market-tbody');
    tbody.innerHTML = '';

    const inventoryMap = new Map((player.inventory || []).map(i => [i.goodId, i.quantity]));

    window.GOODS.forEach(good => {
        const canBuy = city?.market?.buy?.includes(good.id) || false;
        const canSell = city?.market?.sell?.includes(good.id) || false;
        if (!canBuy && !canSell) return;

        const buyPrice = canBuy ? marketPrices[good.id].buy : null;
        const sellPrice = canSell ? marketPrices[good.id].sell : null;
        const inStock = inventoryMap.get(good.id) || 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${good.icon || '📦'} <strong>${good.name}</strong></td>
            <td class="text-center">
                ${canBuy ? `<button class="fantasy-btn" data-id="${good.id}" data-mode="buy">${buyPrice} 💰</button>` : '-'}
            </td>
            <td class="text-center">
                ${canSell ? `<button class="fantasy-btn" data-id="${good.id}" data-mode="sell">${sellPrice} 💰</button>` : '-'}
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.fantasy-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            openTradeModal(this.dataset.id, this.dataset.mode, city);
        });
    });
}

function setupModal() {
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-confirm').addEventListener('click', confirmTrade);
    document.getElementById('qty-plus').addEventListener('click', () => changeQuantity(1));
    document.getElementById('qty-minus').addEventListener('click', () => changeQuantity(-1));
}

function openTradeModal(goodId, mode, city) {
    currentGood = window.GOODS.find(g => String(g.id) === String(goodId));
    if (!currentGood) return;

    currentMode = mode;
    currentPrice = marketPrices[goodId][mode];

    const limits = getLimits(currentPrice);
    const inventoryQty = player.inventory?.find(i => i.goodId == goodId)?.quantity || 0;
    
    // Максимум для продажи не может превышать то, что есть в наличии
    const available = mode === 'buy' ? limits.max : Math.min(inventoryQty, limits.max);

    document.getElementById('modal-title').textContent = mode === 'buy' ? 'Покупка' : 'Продажа';
    document.getElementById('modal-good-name').textContent = currentGood.name;
    document.getElementById('modal-price').textContent = currentPrice;
    document.getElementById('modal-available').textContent = available;
    document.getElementById('qty-value').textContent = limits.min;

    updateTotalPrice();
    document.getElementById('market-modal').style.display = 'flex';
}

function closeModal() { document.getElementById('market-modal').style.display = 'none'; }

function changeQuantity(delta) {
    const qtyElement = document.getElementById('qty-value');
    const limits = getLimits(currentPrice);
    let qty = parseInt(qtyElement.textContent) + delta;
    
    qty = Math.max(limits.min, Math.min(limits.max, qty));
    qtyElement.textContent = qty;
    updateTotalPrice();
}

function updateTotalPrice() {
    const qty = parseInt(document.getElementById('qty-value').textContent);
    document.getElementById('modal-total').innerHTML = `Итого: <span class="highlight">${qty * currentPrice}</span> монет`;
}

function confirmTrade() {
    if (!currentGood) return;
    const qty = parseInt(document.getElementById('qty-value').textContent);
    const limits = getLimits(currentPrice);

    // Защитная проверка лимитов
    if (qty < limits.min || qty > limits.max) return alert("Недопустимое количество!");

    if (currentMode === 'buy') {
        const totalCost = qty * currentPrice;
        if (player.gold < totalCost) return alert("Недостаточно золота!");
        if ((player.weight || 0) + qty * currentGood.weight > (player.transport?.capacity || 100)) return alert("Слишком тяжело!");

        player.gold -= totalCost;
        player.weight = (player.weight || 0) + qty * currentGood.weight;
        const existing = player.inventory.find(i => i.goodId == currentGood.id);
        existing ? existing.quantity += qty : player.inventory.push({ goodId: currentGood.id, quantity: qty });
    } else {
        const index = player.inventory.findIndex(i => i.goodId == currentGood.id);
        if (index === -1 || player.inventory[index].quantity < qty) return alert("Недостаточно товара!");
        player.inventory[index].quantity -= qty;
        if (player.inventory[index].quantity <= 0) player.inventory.splice(index, 1);
        player.gold += qty * currentPrice;
        player.weight = Math.max(0, player.weight - qty * currentGood.weight);
    }

    savePlayer(player);
    if (typeof updateHeaderInfo === 'function') updateHeaderInfo(player);
    closeModal();
    
    const city = window.CITIES ? window.CITIES.find(c => c.id === player.cityId) : cities.find(c => c.id === player.cityId);
    renderMarketTable(city);
}
