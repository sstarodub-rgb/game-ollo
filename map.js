const player = JSON.parse(localStorage.getItem("merchantGame"));
const mapField = document.getElementById('map-field');
const travelBtn = document.getElementById('travel-btn');
const backBtn = document.getElementById('back-to-city-btn');
const routes = window.ROUTES[player.cityId] || [];

// Координаты для 8 городов (1 центр + 2 больших + 5 маленьких)
const POSITIONS = {
    "oak-holl":   { left: '50%', top: '25%' },
    "riverwood":  { left: '30%', top: '55%' },
    "dustmire":   { left: '70%', top: '55%' },
    "stonegate":  { left: '15%', top: '80%' },
    "goldport":   { left: '35%', top: '80%' },
    "suncrest":   { left: '55%', top: '80%' },
    "ironpeak":   { left: '75%', top: '80%' },
    "shadowfen":  { left: '95%', top: '80%' }
};

backBtn.addEventListener('click', () => window.location.href = 'index.html');
travelBtn.addEventListener('click', () => {
    if(!travelBtn.disabled) window.location.href = 'road.html';
});

window.CITIES.forEach((city) => {
    const div = document.createElement('div');
    const pos = POSITIONS[city.id] || { left: '50%', top: '50%' };
    const isBig = city.id === player.cityId || routes.includes(city.id);

    div.className = `city-node ${isBig ? 'big' : 'small'}`;
    div.style.left = pos.left;
    div.style.top = pos.top;
    div.innerHTML = `<span>${city.icon}</span><label>${city.name}</label>`;

    div.addEventListener('click', () => {
        if (routes.includes(city.id)) {
            document.querySelectorAll('.city-node').forEach(n => n.classList.remove('selected'));
            div.classList.add('selected');
            travelBtn.disabled = false;
            localStorage.setItem('targetCityId', city.id);
        }
    });
    mapField.appendChild(div);
});
