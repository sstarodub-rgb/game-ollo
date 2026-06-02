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

  const goodsRes = await fetch("./goods.json");
  goods = await goodsRes.json();

  const citiesRes = await fetch("./cities.json");
  cities = await citiesRes.json();

  city = cities.find(c => c.id === player.cityId);

  marketModifier = JSON.parse(
    localStorage.getItem("marketModifier") || "{}"
  );

  buildCategories();
  renderCity();
  renderFilters();
  renderGoods();
}

function buildCategories() {
  const set = new Set();

  goods.forEach(g => {
    if (g.categoryName) {
      set.add(g.categoryName);
    }
  });

  categories = ["Все", ...Array.from(set)];
}

function renderCity() {
  if (!city) return;

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
      btn.style.borderColor = "#c89b3c";
      btn.style.color = "#c89b3c";
    }

    btn.addEventListener("click", () => {
      selectedCategory = cat;
      renderFilters();
      renderGoods();
    });

    container.appendChild(btn);
  });
}

function getGoodById(id) {
  return goods.find(g => g.id === id);
}

function getModifier(id) {
  return marketModifier[id] || 1;
}

function getBuyPrice(good) {
  return Math.round(good.basePrice * getModifier(good.id));
}

function getSellPrice(good) {
  return Math.round(good.basePrice * getModifier(good.id) * 0.8);
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
    .filter(g => {
      if (selectedCategory === "Все") return true;
      return g.categoryName === selectedCategory;
    })
    .forEach(good => {
      const row = document.createElement("div");
      row.className = "market-row";

      const sell = canSell(good.id)
        ? `<button class="market-price-btn" data-id="${good.id}" data-type="sell">
            ${getSellPrice(good)}
           </button>`
        : "—";

      const buy = canBuy(good.id)
        ? `<button class="market-price-btn" data-id="${good.id}" data-type="buy">
            ${getBuyPrice(good)}
           </button>`
        : "—";

      row.innerHTML = `
        <div>${good.icon} ${good.name}</div>
        <div>${sell}</div>
        <div>${buy}</div>
      `;

      container.appendChild(row);
    });

  bindButtons();
}

function bindButtons() {
  document.querySelectorAll(".market-price-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const type = btn.dataset.type;

      openModal(id, type);
    });
  });
}

function openModal(id, type) {
  const good = getGoodById(id);
  if (!good) return;

  const price =
    type === "buy"
      ? getBuyPrice(good)
      : getSellPrice(good);

  document.getElementById("market-modal").classList.remove("hidden");
  document.getElementById("modal-title").textContent =
    type === "buy" ? `Купить: ${good.name}` : `Продать: ${good.name}`;

  document.getElementById("modal-price").textContent =
    `Цена: ${price}`;

  document.getElementById("modal-total").textContent = "";
}

document.getElementById("modal-cancel")?.addEventListener("click", () => {
  document.getElementById("market-modal").classList.add("hidden");
});

loadData();