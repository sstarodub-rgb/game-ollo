const player = JSON.parse(localStorage.getItem("merchantGame"));
let selectedCityId = null;

function initMap() {
    const mapField = document.getElementById('map-field');
    const travelBtn = document.getElementById('travel-btn');
    const currentCityId = player.cityId;
    const availableRoutes = window.ROUTES[currentCityId] || [];

    window.CITIES.forEach(city => {
        const div = document.createElement('div');
        
        // Логика позиционирования
        if (city.id === currentCityId) {
            div.className = 'city-node big current';
            div.style.left = '50%';
            div.style.top = '50%';
        } else if (availableRoutes.includes(city.id)) {
            div.className = 'city-node big';
            // Позиции для двух доступных городов
            const index = availableRoutes.indexOf(city.id);
            div.style.left = index === 0 ? '25%' : '75%';
            div.style.top = index === 0 ? '30%' : '70%';
        } else {
            div.className = 'city-node small';
            // Оставшиеся города по углам
            div.style.left = (Math.random() * 80 + 10) + '%';
            div.style.top = (Math.random() * 80 + 10) + '%';
        }

        div.innerHTML = `<span>${city.icon}</span><label>${city.name}</label>`;
        
        div.onclick = () => {
            if (availableRoutes.includes(city.id)) {
                selectedCityId = city.id;
                document.querySelectorAll('.city-node').forEach(n => n.classList.remove('selected'));
                div.style.border = "2px solid red"; // Визуальная метка выбора
                travelBtn.disabled = false;
            }
        };
        mapField.appendChild(div);
    });
}

initMap();
