const player = JSON.parse(localStorage.getItem("merchantGame"));
let selectedCityId = null;

function initMap() {
    const mapField = document.getElementById('map-field');
    const travelBtn = document.getElementById('travel-btn');

    // Отрисовка городов
    window.CITIES.forEach(city => {
        const div = document.createElement('div');
        div.className = `city-node ${city.id === player.cityId ? 'current' : ''}`;
        // Масштабируем координаты (ваши значения до 900-1000)
        div.style.left = (city.x / 10) + '%';
        div.style.top = (city.y / 10) + '%';
        
        div.innerHTML = `<span>${city.icon}</span><label>${city.name}</label>`;
        
        div.onclick = () => {
            if (window.ROUTES[player.cityId].includes(city.id)) {
                selectedCityId = city.id;
                document.querySelectorAll('.city-node').forEach(n => n.classList.remove('selected'));
                div.classList.add('selected');
                travelBtn.disabled = false;
            }
        };
        mapField.appendChild(div);
    });

    document.getElementById('travel-btn').onclick = () => {
        if (selectedCityId) {
            localStorage.setItem('targetCityId', selectedCityId);
            window.location.href = 'road.html';
        }
    };

    document.getElementById('back-to-city-btn').onclick = () => window.location.href = 'index.html';
}

initMap();
