// market.js
let currentFilter = 'all';
let selectedGood = null;
let modalMode = null; // 'buy' или 'sell'

const STORAGE_KEYS = { PLAYER: "merchantGame" };

function getPlayer() {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER);
    return data ? JSON.parse(data) : null;
}

function savePlayer(player) {
    localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(player));
}

function updateHeaderInfo(player) {
    document.getElementById('player-gold').textContent = player.gold;
    document.getElementById('player-weight').textContent = player.weight || 0;
    document.getElementById('transport-capacity').textContent = player.transport?.capacity || 0;
}

// Получить текущую цену
function getCurrentPrice(good, type) { // type: 'buy' или 'sell'
    const base = good.basePrice;
    const city = cities.find(c => c.id === getPlayer().cityId);
    const modifier = city?.market?.priceModifier || 1.0;
    const random = 0.9 + Math.random() * 0.2; // ±10%
    
    let price = Math.round(base * modifier * random);
    return type === 'sell' ? Math.round(price * 0.85) : price; // продажа дешевле
}

function renderMarketTable() {
    const tbody = document.getElementById('market-tbody');
    tbody.innerHTML = '';

    const player = getPlayer();
    const city = cities.find(c => c.id === player.cityId);
    const inventoryMap = new Map(player.inventory.map(item => [item.goodId, item.quantity]));

    goods.forEach(good => {
        const canBuy = city.market.buy.includes(good.id);
        const canSell = city.market.sell.includes(good.id);

        if (!canBuy && !canSell) return;

        const buyPrice = canBuy ? getCurrentPrice(good, 'buy') : null;
        const sellPrice = canSell ? getCurrentPrice(good, 'sell') : null;
        const qtyInInventory = inventoryMap.get(good.id) || 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="good-icon">${good.icon}</td>
            <td>
                <strong>${good.name}</strong><br>
                <small>${good.category}</small>
            </td>
            <td class="text-center">
                ${canBuy ? `<button class="btn-buy" data-id="${good.id}" data-mode="buy">${buyPrice} 💰</button>` : '-'}
            </td>
            <td class="text-center">
                ${canSell && qtyInInventory > 0 
                    ? `<button class="btn-sell" data-id="${good.id}" data-mode="sell">${sellPrice} 💰</button>` 
                    : '<span class="text-muted">—</span>'}
            </td>
        `;

        tbody.appendChild(row);
    });

    // Привязываем события
    document.querySelectorAll('.btn-buy, .btn-sell').forEach(btn => {
        btn.addEventListener('click', () => openModal(parseInt(btn.dataset.id), btn.dataset.mode));
    });
}

function openModal(goodId, mode) {
    const good = goods.find(g => g.id === goodId);
    if (!good) return;

    selectedGood = good;
    modalMode = mode;

    const player = getPlayer();
    const city = cities.find(c => c.id === player.cityId);
    const price = getCurrentPrice(good, mode);
    const available = mode === 'buy' 
        ? 999 // для покупки почти не ограничено
        : (player.inventory.find(i => i.goodId === goodId)?.quantity || 0);

    document.getElementById('modal-title').textContent = mode === 'buy' ? 'Покупка' : 'Продажа';
    document.getElementById('modal-good-name').textContent = good.name;
    document.getElementById('modal-price').textContent = price;
    document.getElementById('modal-available').textContent = available;

    document.getElementById('qty-value').textContent = 1;
    updateTotal();

    document.getElementById('market-modal').classList.remove('hidden');
}

// Обновление итого в модалке
function updateTotal() {
    const qty = parseInt(document.getElementById('qty-value').textContent);
    const price = parseInt(document.getElementById('modal-price').textContent);
    document.getElementById('modal-total').innerHTML = `Итого: <span class="highlight">${qty * price}</span> монет`;
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const player = getPlayer();
    if (!player) {
        window.location.href = 'index.html';
        return;
    }

    // Заполняем город
    const city = cities.find(c => c.id === player.cityId);
    if (city) {
        document.getElementById('market-city-name').textContent = city.name;
        document.getElementById('market-city-region').textContent = city.region || '';
        document.getElementById('market-city-icon').textContent = city.icon || '🏪';
    }

    updateHeaderInfo(player);
    renderMarketTable();

    // Кнопка назад
    document.getElementById('back-to-city-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Модалка
    document.getElementById('modal-cancel').addEventListener('click', () => {
        document.getElementById('market-modal').classList.add('hidden');
    });

    document.getElementById('qty-plus').addEventListener('click', () => {
        let qty = parseInt(document.getElementById('qty-value').textContent);
        document.getElementById('qty-value').textContent = qty + 1;
        updateTotal();
    });

    document.getElementById('qty-minus').addEventListener('click', () => {
        let qty = parseInt(document.getElementById('qty-value').textContent);
        if (qty > 1) {
            document.getElementById('qty-value').textContent = qty - 1;
            updateTotal();
        }
    });

    // TODO: добавить логику подтверждения сделки в modal-confirm
});