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

    city = cities.find(c => c.id === player.cityId);

    console.log("CITY:", city);
    console.log("GOODS:", goods.length);

  } catch (e) {
    console.error("LOAD ERROR:", e);
    return;
  }

  marketModifier = JSON.parse(
    localStorage.getItem("marketModifier") || "{}"
  );

  if (!city || !city.market) {
    console.error("NO CITY MARKET DATA");
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
  document.getElementById("market-city-name").textContent = city.name;
  document.getElementById("market-city-icon").textContent = city.icon;
}

function renderFilters() {
  const container = document.getElementById("market-filters");

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

      row.innerHTML = `
        <div>${g.icon} ${g.name}</div>
        <div>
          ${canSell(g.id)
            ? `<button class="market-price-btn" data-id="${g.id}" data-type="sell">${getSellPrice(g)}</button>`
            : "—"}
        </div>
        <div>
          ${canBuy(g.id)
            ? `<button class="market-price-btn" data-id="${g.id}" data-type="buy">${getBuyPrice(g)}</button>`
            : "—"}
        </div>
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