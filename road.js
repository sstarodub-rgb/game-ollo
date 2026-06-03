const player = JSON.parse(localStorage.getItem("merchantGame"));
const targetCityId = parseInt(localStorage.getItem("targetCityId"));

// Задержка на 8 секунд (по длительности анимации в CSS)
setTimeout(() => {
    player.cityId = targetCityId;
    localStorage.setItem("merchantGame", JSON.stringify(player));
    localStorage.removeItem("targetCityId");
    window.location.href = 'index.html';
}, 8000);

