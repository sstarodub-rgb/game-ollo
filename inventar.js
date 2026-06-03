const player = JSON.parse(localStorage.getItem("merchantGame"));

function initInventar() {
    if (!player) return;

    // Кнопка назад
    document.getElementById('back-to-city-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    renderInventory();
}

function renderInventory() {
    const tbody = document.getElementById('inventory-tbody');
    tbody.innerHTML = '';

    const maxWeight = player.transport.capacity;
    const currentWeight = player.weight;

    // Обновляем текст и полоску
    document.getElementById('weight-numbers').textContent = `${currentWeight}/${maxWeight}`;
    const percent = Math.min((currentWeight / maxWeight) * 100, 100);
    document.getElementById('progress-bar').style.width = percent + '%';

    // Рендер таблицы
    player.inventory.forEach(item => {
        const good = window.GOODS.find(g => g.id === item.goodId);
        if (!good) return;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="good-icon">${good.icon}</td>
            <td><strong>${good.name}</strong><br><small>${good.categoryName}</small></td>
            <td class="text-center">${item.quantity} шт.</td>
            <td class="text-center">${item.quantity * good.weight} ед.</td>
        `;
        tbody.appendChild(row);
    });
}

initInventar();
