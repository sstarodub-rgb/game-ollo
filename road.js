const player = JSON.parse(localStorage.getItem("merchantGame"));
const targetCityId = parseInt(localStorage.getItem("targetCityId"));
const wagon = document.getElementById('wagon');

// Через 10 секунд (длительность анимации) обновляем город
setTimeout(() => {
    player.cityId = targetCityId;
    localStorage.setItem("merchantGame", JSON.stringify(player));
    localStorage.removeItem("targetCityId");
    window.location.href = 'index.html';
}, 10000);
