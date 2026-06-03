const player = JSON.parse(localStorage.getItem("merchantGame"));
let selectedCityId = null;

function initMap() {
    const mapField = document.getElementById('map-field');
    mapField.innerHTML = ''; // Очищаем перед отрисовкой
    const currentCityId = player.cityId;
    const availableRoutes = window.ROUTES[currentCityId] || [];

    // Создаем функцию для отрисовки города
    const renderCity = (city, type) => {
        const div = document.createElement('div');
        div.className = `city-node ${type === 'big' ? 'big' : 'small'}`;
        div.innerHTML = `<span>${city.icon}</span><label>${city.name}</label>`;
        
        div.onclick = () => {
            if (availableRoutes.includes(city.id)) {
                selectedCityId = city.id;
                document.querySelectorAll('.city-node').forEach(n => n.classList.remove('selected'));
                div.classList.add('selected');
                document.getElementById('travel-btn').disabled = false;
            }
        };
        mapField.appendChild(div);
    };

    // 1. Рисуем текущий (центр)
    const currentCity = window.CITIES.find(c => c.id === currentCityId);
    renderCity(currentCity, 'big');

    // 2. Рисуем доступные
    window.CITIES.filter(c => availableRoutes.includes(c.id)).forEach(c => renderCity(c, 'big'));

    // 3. Рисуем остальные маленькими
    window.CITIES.filter(c => c.id !== currentCityId && !availableRoutes.includes(c.id))
                 .forEach(c => renderCity(c, 'small'));
}

initMap();
