alert("js loaded");
// market.js — Полная функциональность рынка

document.addEventListener('DOMContentLoaded', () => {
    const player = getPlayer();
    if (!player) {
        window.location.href = 'index.html';
        return;
    }

    // === Инициализация страницы ===
    const city = window.CITIES?.find(c => c.id === player.cityId) || 
                 cities.find(c => c.id === player.cityId);

    if (city) {
        document.getElementById('market-city-name').textContent = city.name;
        document.getElementById('market-city-region').textContent = city.region || '';
        document.getElementById('market-city-icon').textContent = city.icon || '🏪';
    }

    updateInfoBar(player);
    renderMarketTable(player, city);

    // === Кнопка "Назад в город" ===
    document.getElementById('back-to-city-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // === Модалка ===
    setupModalListeners();
});

// ====================== ОСНОВНЫЕ ФУНКЦИИ ======================

function getPlayer() {
    const data = localStorage.getItem("merchantGame");
    return data ? JSON.parse(data) : null;
}

function savePlayer(player) {
    localStorage.setItem("merchantGame", JSON.stringify(player));
}

function updateInfoBar(player) {
    document.getElementById('player-gold').textContent = player.gold || 0;
    document.getElementById('player-weight').textContent = player.weight || 0;
    document.getElementById('transport-capacity').textContent = player.transport?.capacity || 100;
}

function getCurrentPrice(good, type, city) { // type: 'buy' | 'sell'
    const base = good.basePrice || 10;
    const modifier = city?.market?.priceModifier || 1.0;
    const fluctuation = 0.9 + Math.random() * 0.2; // ±10%

    let price = Math.round(base * modifier * fluctuation);
    
    if (type === 'sell') {
        price = Math.round(price * 0.82); // продажа дешевле
    }
    return Math.max(price, 1);
}

function renderMarketTable(player, city) {
    const tbody = document.getElementById('market-tbody');
    tbody.innerHTML = '';

    const inventoryMap = new Map(
        (player.inventory || []).map(item => [item.goodId, item.quantity])
    );

    goods.forEach(good => {
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
                <small>${good.categoryName || good.category}</small>
            </td>
            <td class="text-center">
                ${canBuy ? 
                    `<button class="btn-buy fantasy-btn" data-id="${good.id}" data-mode="buy">${buyPrice} 💰</button>` : 
                    '<span class="text-muted">—</span>'}
            </td>
            <td class="text-center">
                ${canSell && inStock > 0 ? 
                    `<button class="btn-sell fantasy-btn" data-id="${good.id}" data-mode="sell">${sellPrice} 💰</button>` : 
                    '<span class="text-muted">—</span>'}
            </td>
        `;

        tbody.appendChild(row);
    });

    // Привязка событий
    document.querySelectorAll('.fantasy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const goodId = parseInt(e.target.dataset.id);
            const mode = e.target.dataset.mode;
            openTradeModal(goodId, mode, city);
        });
    });
}

// ====================== МОДАЛКА ======================

let currentGood = null;
let currentMode = null;
let currentPrice = 0;

function setupModalListeners() {
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    
    document.getElementById('modal-confirm').addEventListener('click', confirmTrade);

    document.getElementById('qty-plus').addEventListener('click', () => changeQuantity(1));
    document.getElementById('qty-minus').addEventListener('click', () => changeQuantity(-1));
}

function openTradeModal(goodId, mode, city) {
    currentGood = goods.find(g => g.id === goodId);
    if (!currentGood) return;

    currentMode = mode;
    currentPrice = getCurrentPrice(currentGood, mode, city);

    const player = getPlayer();
    const available = mode === 'buy' ? 999 : 
        (player.inventory?.find(i => i.goodId === goodId)?.quantity || 0);

    document.getElementById('modal-title').textContent = mode === 'buy' ? 'Покупка' : 'Продажа';
    document.getElementById('modal-good-name').textContent = currentGood.name;
    document.getElementById('modal-price').textContent = currentPrice;
    document.getElementById('modal-available').textContent = available;

    document.getElementById('qty-value').textContent = 1;
    updateTotalPrice();

    document.getElementById('market-modal').classList.remove('hidden');
    document.getElementById('market-modal').style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('market-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

function changeQuantity(delta) {
    let qty = parseInt(document.getElementById('qty-value').textContent);
    qty = Math.max(1, Math.min(qty + delta, 999));
    document.getElementById('qty-value').textContent = qty;
    updateTotalPrice();
}

function updateTotalPrice() {
    const qty = parseInt(document.getElementById('qty-value').textContent);
    const total = qty * currentPrice;
    document.getElementById('modal-total').innerHTML = `Итого: <span class="highlight">${total}</span> монет`;
}

function confirmTrade() {
    if (!currentGood || !currentMode) return;

    const qty = parseInt(document.getElementById('qty-value').textContent);
    const player = getPlayer();

    if (currentMode === 'buy') {
        const totalCost = qty * currentPrice;
        if (player.gold < totalCost) {
            alert("Недостаточно золота!");
            return;
        }
        if ((player.weight || 0) + qty * currentGood.weight > player.transport.capacity) {
            alert("Слишком тяжело для твоего транспорта!");
            return;
        }

        player.gold -= totalCost;
        player.weight = (player.weight || 0) + qty * currentGood.weight;

        // Добавляем в инвентарь
        const existing = player.inventory.find(i => i.goodId === currentGood.id);
        if (existing) {
            existing.quantity += qty;
        } else {
            player.inventory.push({
                goodId: currentGood.id,
                quantity: qty
            });
        }

        addToLog(`Куплено ${qty}× ${currentGood.name} за ${totalCost} монет`);

    } else { // sell
        const totalEarn = qty * currentPrice;
        const item = player.inventory.find(i => i.goodId === currentGood.id);
        
        if (!item || item.quantity < qty) {
            alert("Недостаточно товара!");
            return;
        }

        item.quantity -= qty;
        if (item.quantity <= 0) {
            player.inventory = player.inventory.filter(i => i.goodId !== currentGood.id);
        }

        player.gold += totalEarn;
        player.weight = Math.max(0, player.weight - qty * currentGood.weight);

        addToLog(`Продано ${qty}× ${currentGood.name} за ${totalEarn} монет`);
    }

    savePlayer(player);
    closeModal();
    renderMarketTable(player, window.CITIES?.find(c => c.id === player.cityId));
    updateInfoBar(player);
}

function addToLog(text) {
    const player = getPlayer();
    if (!player.log) player.log = [];
    
    player.log.push({
        text: text,
        cityId: player.cityId,
        timestamp: Date.now()
    });
    
    // Оставляем только последние 50 записей
    if (player.log.length > 50) player.log.shift();
}