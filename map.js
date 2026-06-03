const player = JSON.parse(localStorage.getItem("merchantGame"));
const mapField = document.getElementById('map-field');
const travelBtn = document.getElementById('travel-btn');
const backBtn = document.getElementById('back-to-city-btn');
const routes = window.ROUTES[player.cityId] || [];

// Логика кнопок
backBtn.onclick = () => window.location.href = 'index.html';
travelBtn.onclick = () => window.location.href = 'road.html';

// Отрисовка
window.CITIES.forEach((city) => {
    const div = document.createElement('div');
    let pos, size;

    if (city.id === player.cityId) {
        pos = { left: '50%', top: '25%' };
        size = 'big';
    } else if (routes.includes(city.id)) {
        pos = routes.indexOf(city.id) === 0 ? { left: '25%', top: '55%' } : { left: '75%', top: '55%' };
        size = 'big';
    } else {
        pos = { left: (15 + Math.random() * 70) + '%', top: (75 + Math.random() * 20) + '%' };
        size = 'small';
    }

    div.className = `city-node ${size}`;
    div.style.left = pos.left;
    div.style.top = pos.top;
    div.innerHTML = `<span>${city.icon}</span><label>${city.name}</label>`;

    div.onclick = () => {
        if (routes.includes(city.id)) {
            document.querySelectorAll('.city-node').forEach(n => n.classList.remove('selected'));
            div.classList.add('selected');
            travelBtn.disabled = false;
            localStorage.setItem('targetCityId', city.id);
        }
    };
    mapField.appendChild(div);
});
