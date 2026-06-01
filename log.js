const LOG_KEY = "merchantLog";

function getLog() {
    const data = localStorage.getItem(LOG_KEY);
    return data ? JSON.parse(data) : [];
}

function saveLog(log) {
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
}

function addLog(text) {
    const log = getLog();
    const player = JSON.parse(localStorage.getItem("merchantGame"));

    const entry = {
        day: player?.day || 1,
        text: text,
        time: Date.now()
    };

    log.unshift(entry);

    saveLog(log);

    renderLog();
}

function renderLog() {

    const old = document.querySelector(".game-log");
    if (old) old.remove();

    const container = document.createElement("div");
    container.className = "game-log";

    const log = getLog();

    container.innerHTML = log.map(entry => `
        <div class="log-entry">
            День ${entry.day}. ${entry.text}
        </div>
    `).join("");

    document.getElementById("game").appendChild(container);
}

document.addEventListener("DOMContentLoaded", renderLog);