const player = JSON.parse(localStorage.getItem("merchantGame"));
const mapField = document.getElementById('map-field');
const travelBtn = document.getElementById('travel-btn');
const backBtn = document.getElementById('back-to-city-btn');
const routes = window.ROUTES[player.cityId] || [];

backBtn.addEventListener('click', () => window.location.href = 'index.html');
travelBtn.addEventListener('click', () => { if(!travelBtn.disabled) window.location.href = 'road.html'; });

window.CITIES.forEach((city) => {
    const div = document.createElement('div');
    // Используем ваши x и y из cities.js
    div.style.left = (city.x / 10) + '%';
    div.style.top = (city.y / 10) + '%';
    
    const isAvailable = routes.includes(city.id);
    div.className = `city-node ${isAvailable || city.id === player.cityId ? 'big' : 'small'}`;
    div.innerHTML = `<span>${city.icon}</span><label>${city.name}</label>`;

    div.addEventListener('click', () => {
        if (isAvailable) {
            document.querySelectorAll('.city-node').forEach(n => n.classList.remove('selected'));
            div.classList.add('selected');
            travelBtn.disabled = false;
            localStorage.setItem('targetCityId', city.id);
        }
    });
    mapField.appendChild(div);
});
