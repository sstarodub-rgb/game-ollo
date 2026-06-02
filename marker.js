let player = null;
let city = null;
let goods = [];
let cities = [];
let marketModifier = {};

let selectedCategory = "Все";
let categories = ["Все"];

async function loadData() {
  console.log("INIT MARKET");

  const playerData = localStorage.getItem("merchantGame");

  if (!playerData) {
    console.error("NO PLAYER");
    return;
  }

  player = JSON.parse(playerData);
  console.log("PLAYER:", player);

  try {
    const goodsRes = await fetch("./goods.json");
    const citiesRes = await fetch("./cities.json");

    console.log("GOODS STATUS:", goodsRes.status);
    console.log("CITIES STATUS:", citiesRes.status);

    if (!goodsRes.ok || !citiesRes.ok) {
      console.error("JSON FILES NOT FOUND");
      return;
    }

    goods = await goodsRes.json();
    cities = await citiesRes.json();

    console.log("GOODS LOADED:", goods.length);
    console.log("CITIES LOADED:", cities.length);

  } catch (e) {
    console.error("FETCH ERROR:", e);
    return;
  }

  city = cities.find(c => c.id == player.cityId);

  console.log("FOUND CITY:", city);

  if (!city) {
    console.error("CITY NOT FOUND");
    return;
  }

  if (!city.market) {
    console.error("NO MARKET IN CITY");
    return;
  }

  marketModifier =
    JSON.parse(localStorage.getItem("marketModifier")) || {};

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

  categories = ["Все", ...set];
}

function renderCity() {
  document.getElementById("market-city-name").textContent = city.name;
  document.getElementById("market-city-icon").textContent = city.icon;
}

function renderFilters() {
  const el = document.getElementById("market-filters");
  el.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = "market-filter-btn";

    if (cat === selectedCategory) {
      btn.classList.add("active");
    }

    btn.onclick = () => {
      selectedCategory = cat;
      renderFilters();
      renderGoods();
    };

    el.appendChild(btn);
  });
}

function modifier(id) {
  return marketModifier[id] || 1;
}

function buyPrice(g) {
  return Math.round(g.basePrice * modifier(g.id));
}

function sellPrice(g) {
  return Math.round(g.basePrice * modifier(g.id) * 0.8);
}

function canBuy(id) {
  return city.market.buy.includes(id);
}

function canSell(id) {
  return city.market.sell.includes(id);
}

function renderGoods() {
  const el = document.getElementById("market-list");

  el.innerHTML = `
    <div class="market-header">
      <div>Товар</div>
      <div>Продажа</div>
      <div>Покупка</div>
    </div>
  `;

  console.log("RENDER GOODS");

  goods
    .filter(g =>
      selectedCategory === "Все" ||
      g.categoryName === selectedCategory
    )
    .forEach(g => {
      const row = document.createElement("div");
      row.className = "market-row";

      row.innerHTML = `
        <div>${g.icon} ${g.name}</div>
        <div>${canSell(g.id) ? sellPrice(g) : "—"}</div>
        <div>${canBuy(g.id) ? buyPrice(g) : "—"}</div>
      `;

      el.appendChild(row);
    });
}

loadData();