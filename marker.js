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

  } catch (e) {
    console.error(e);
    return;
  }

  marketModifier = JSON.parse(
    localStorage.getItem("marketModifier") || "{}"
  );

  if (!city || !city.market) return;

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
  const el = document.getElementById("market-filters");
  el.innerHTML = "";

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
  return city?.market?.buy?.includes(id);
}

function canSell(id) {
  return city?.market?.sell?.includes(id);
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

  goods
    .filter(g => selectedCategory === "Все" || g.categoryName === selectedCategory)
    .forEach(g => {
      const row = document.createElement("div");
      row.className = "market-row";

      row.innerHTML = `
        <div>${g.icon} ${g.name}</div>
        <div>${canSell(g.id) ? `<button class="market-price-btn">${sellPrice(g)}</button>` : "—"}</div>
        <div>${canBuy(g.id) ? `<button class="market-price-btn">${buyPrice(g)}</button>` : "—"}</div>
      `;

      el.appendChild(row);
    });
}

loadData();