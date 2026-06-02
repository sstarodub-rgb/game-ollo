// market.js
document.addEventListener('DOMContentLoaded', () => {
    const player = JSON.parse(localStorage.getItem("merchantGame"));
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

    // Инфо
    document.getElementById('player-gold').textContent = player.gold || 0;
    document.getElementById('player-weight').textContent = player.weight || 0;
    document.getElementById('transport-capacity').textContent = player.transport?.capacity || 30;

    // Кнопка назад
    document.getElementById('back-to-city-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Закрытие модалки
    document.getElementById('modal-cancel').addEventListener('click', () => {
        document.getElementById('market-modal').classList.add('hidden');
    });

    // Показываем, что таблица пока пустая (для теста)
    document.getElementById('market-tbody').innerHTML = `
        <tr><td colspan="4" style="text-align:center; padding:40px;">
            Таблица товаров будет здесь...<br>
            <small>Скоро добавим товары</small>
        </td></tr>
    `;
});