const player = JSON.parse(localStorage.getItem("merchantGame"));
const targetCityId = parseInt(localStorage.getItem("targetCityId"));

function finishTravel() {
    player.cityId = targetCityId;
    localStorage.setItem("merchantGame", JSON.stringify(player));
    localStorage.removeItem("targetCityId");
    window.location.href = 'index.html';
}

setTimeout(() => {
    // Шанс события 30%
    if (Math.random() < 0.3) {
        const event = window.EVENTS[Math.floor(Math.random() * window.EVENTS.length)];
        const resultText = event.effect(player);
        
        document.getElementById('event-text').innerText = event.text;
        document.getElementById('event-result').innerText = resultText;
        document.getElementById('event-modal').style.display = 'flex';
        
        // Сохраняем состояние после события
        localStorage.setItem("merchantGame", JSON.stringify(player));
    } else {
        finishTravel();
    }
}, 8000);
