const player = JSON.parse(localStorage.getItem("merchantGame"));
let selectedCityId = null;

function initMap() {
    const mapField = document.getElementById('map-field');
    const currentCityId = player.cityId;
    const routes = window.ROUTES[currentCityId] || [];

    // Определяем позиции (в процентах)
    const positions = {
        center: { left: '50%', top: '25%' }, // Текущий
        left: { left: '25%', top: '55%' },   // Доступный 1
        right: { left: '75%', top: '55%' },  // Доступный 2
        others: [ // Маленькие группки
            { left: '15%', top: '80%' }, { left: '30%', top: '85%' },
            { left: '70%', top: '85%' }, { left: '85%', top: '80%' }, { left: '50%', top: '90%' }
        ]
    };

    // Отрисовка
    window.CITIES.forEach((city, index) => {
        const div = document.createElement('div');
        let pos, size;

        if (city.id === currentCityId) {
            pos = positions.center;
            size = 'big';
        } else if (routes.includes(city.id)) {
            pos = routes.indexOf(city.id) === 0 ? positions.left : positions.right;
            size = 'big';
        } else {
            pos = positions.others.pop() || { left: '50%', top: '95%' };
            size = 'small';
        }

        div.className = `city-node ${size}`;
        div.style.left = pos.left;
        div.style.top = pos.top;
        div.innerHTML = `<span>${city.icon}</span><label>${city.name}</label>`;

        div.onclick = () => {
            if (routes.includes(city.id)) {
                selectedCityId = city.id;
                document.querySelectorAll('.city-node').forEach(n => n.classList.remove('selected'));
                div.classList.add('selected');
                document.getElementById('travel-btn').disabled = false;
            }
        };
        mapField.appendChild(div);
    });
}
initMap();
