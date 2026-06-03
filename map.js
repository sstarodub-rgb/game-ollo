const player = JSON.parse(localStorage.getItem("merchantGame"));
let selectedCityId = null;

function initMap() {
    const mapField = document.getElementById('map-field');
    const currentCityId = player.cityId;
    const availableRoutes = window.ROUTES[currentCityId] || [];

    window.CITIES.forEach(city => {
        const div = document.createElement('div');
        let pos = { left: '10%', top: '10%' }; // По умолчанию где-то с краю
        let className = 'city-node small';

        // 1. Текущий город (Центр)
        if (city.id === currentCityId) {
            pos = { left: '50%', top: '50%' };
            className = 'city-node big current';
        } 
        // 2. Доступные города (Слева-вверх и Справа-вниз)
        else if (availableRoutes.includes(city.id)) {
            const index = availableRoutes.indexOf(city.id);
            pos = index === 0 ? { left: '25%', top: '30%' } : { left: '75%', top: '70%' };
            className = 'city-node big';
        }

        div.className = className;
        div.style.left = pos.left;
        div.style.top = pos.top;
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
    });
}
