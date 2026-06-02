let player = null;
let city = null;
let goods = [];
let cities = [];
let marketModifier = {};

let selectedCategory = "Все";
let categories = ["Все"];

async function loadData() {
  const playerData = localStorage.getItem("merchantGame");

  if (!playerData) {
    window.location.href = "./index.html";
    return;
  }

  player = JSON.parse(playerData);

  try {
    const [goodsRes, citiesRes] = await Promise.all([
      fetch("./goods.json?v=" + Date.now()),
      fetch("./cities.json?v=" + Date.now())
    ]);

    goods = await goodsRes.json();
    cities = await citiesRes.json();

    console.log("GOODS:", goods.length);
    console.log("CITIES:", cities.length);
    console.log("PLAYER:", player);

    // 🔥 FIX: важно == а не ===
    city = cities.find(c => c.id == player.cityId);

    console.log("FOUND CITY:", city);

  } catch (e) {
    console.error("LOAD ERROR:", e);
    return;
  }

  marketModifier = JSON.parse(
    localStorage.getItem("marketModifier") || "{}"
  );

  if (!city) {
    console.error("CITY NOT FOUND");
    return;
  }

  if (!city.market) {
    console.error("CITY HAS NO MARKET DATA");
    return;
  }

  buildCategories();
  renderCity();
  renderFilters();
  renderGoods();
}

function buildCategories() {
  const set = new Set();

  goods.forEach(g => {
    if (g.categoryName) set.add(g.categoryName);
  });

  categories = ["Все", ...Array.from(set)];
}

function renderCity() {
  const nameEl = document.getElementById("market-city-name");
  const iconEl = document.getElementById("market-city-icon");

  if (!nameEl || !iconEl) return;

  nameEl.textContent = city.name;
  iconEl.textContent = city.icon;
}

function renderFilters() {
  const container = document.getElementById("market-filters");

  if (!container) return;

  container.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "market-filter-btn";
    btn.textContent = cat;

    if (cat === selectedCategory) {
      btn.classList.add("active");
    }

    btn.onclick = () => {
      selectedCategory = cat;
      renderFilters();
      renderGoods();
    };

    container.appendChild(btn);
  });
}

function getModifier(id) {
  return marketModifier[id] || 1;
}

function getBuyPrice(g) {
  return Math.round(g.basePrice * getModifier(g.id));
}

function getSellPrice(g) {
  return Math.round(g.basePrice * getModifier(g.id) * 0.8);
}

function canBuy(id) {
  return city?.market?.buy?.includes(id);
}

function canSell(id) {
  return city?.market?.sell?.includes(id);
}

function renderGoods() {
  const container = document.getElementById("market-list");

  if (!container) return;

  container.innerHTML = `
    <div class="market-header">
      <div>Товар</div>
      <div>Продажа</div>
      <div>Покупка</div>
    </div>
  `;

  goods
    .filter(g => selectedCategory === "Все" || g.categoryName === selectedCategory)
    .forEach(g => {
      const row = document.createElement("div");
      row.className = "market-row";

      const sellBtn = canSell(g.id)
        ? `<button class="market-price-btn" data-id="${g.id}" data-type="sell">
            ${getSellPrice(g)}
           </button>`
        : "—";

      const buyBtn = canBuy(g.id)
        ? `<button class="market-price-btn" data-id="${g.id}" data-type="buy">
            ${getBuyPrice(g)}
           </button>`
        : "—";

      row.innerHTML = `
        <div>${g.icon} ${g.name}</div>
        <div>${sellBtn}</div>
        <div>${buyBtn}</div>
      `;

      container.appendChild(row);
    });

  bindButtons();
}

function bindButtons() {
  document.querySelectorAll(".market-price-btn").forEach(btn => {
    btn.onclick = () => {
      console.log("CLICK:", btn.dataset);
    };
  });
}

loadData();