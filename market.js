// market.js
document.addEventListener('DOMContentLoaded', () => {
    const player = JSON.parse(localStorage.getItem("merchantGame") || "{}");
    if (!player.cityId) {
        window.location.href = "index.html";
        return;
    }

    // Заполняем город
    const city = cities.find(c => c.id === player.cityId);
    if (city) {
        document.getElementById('market-city-name').textContent = city.name;
        document.getElementById('market-city-region').textContent = city.region || '';
        document.getElementById('market-city-icon').textContent = city.icon || '🏪';
    }

    // Инфо-панель
    document.getElementById('player-gold').textContent = player.gold || 0;
    document.getElementById('player-weight').textContent = player.weight || 0;
    document.getElementById('transport-capacity').textContent = player.transport?.capacity || 30;

    // Кнопка "Назад в город"
    document.getElementById('back-to-city-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Закрытие модалки
    document.getElementById('modal-cancel').addEventListener('click', closeModal);

    // Заглушка таблицы (пока без полной логики)
    document.getElementById('market-tbody').innerHTML = `
        <tr>
            <td colspan="4" style="padding: 80px 20px; text-align: center; color: #c9b39b;">
                Таблица товаров загружается...<br>
                <small>Скоро здесь будут товары</small>
            </td>
        </tr>
    `;
});

function closeModal() {
    document.getElementById('market-modal').style.display = 'none';
}