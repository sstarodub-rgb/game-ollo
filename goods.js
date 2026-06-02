alert("goods loaded");
const GOODS = [
  {
    id: 1,
    name: "Зерно",
    category: "food",
    categoryName: "Еда",
    weight: 5,
    basePrice: 12,
    icon: "🌾"
  },
  {
    id: 2,
    name: "Мука",
    category: "food",
    categoryName: "Еда",
    weight: 5,
    basePrice: 18,
    icon: "🌾"
  },
  {
    id: 3,
    name: "Хлеб",
    category: "food",
    categoryName: "Еда",
    weight: 2,
    basePrice: 10,
    icon: "🍞"
  },
  {
    id: 4,
    name: "Рыба",
    category: "food",
    categoryName: "Еда",
    weight: 4,
    basePrice: 22,
    icon: "🐟"
  },
  {
    id: 5,
    name: "Сушёная рыба",
    category: "food",
    categoryName: "Еда",
    weight: 2,
    basePrice: 35,
    icon: "🐟"
  },
  {
    id: 6,
    name: "Мясо",
    category: "food",
    categoryName: "Еда",
    weight: 5,
    basePrice: 30,
    icon: "🍖"
  },
  {
    id: 7,
    name: "Соль",
    category: "food",
    categoryName: "Еда",
    weight: 3,
    basePrice: 25,
    icon: "🧂"
  },
  {
    id: 8,
    name: "Мёд",
    category: "food",
    categoryName: "Еда",
    weight: 2,
    basePrice: 40,
    icon: "🍯"
  },
  {
    id: 9,
    name: "Яблоки",
    category: "food",
    categoryName: "Еда",
    weight: 4,
    basePrice: 14,
    icon: "🍎"
  },
  {
    id: 10,
    name: "Вино",
    category: "food",
    categoryName: "Еда",
    weight: 6,
    basePrice: 60,
    icon: "🍷"
  },

  {
    id: 11,
    name: "Ткань",
    category: "craft",
    categoryName: "Ткани",
    weight: 4,
    basePrice: 50,
    icon: "🧵"
  },
  {
    id: 12,
    name: "Шерсть",
    category: "craft",
    categoryName: "Ткани",
    weight: 5,
    basePrice: 28,
    icon: "🐑"
  },
  {
    id: 13,
    name: "Кожа",
    category: "craft",
    categoryName: "Ткани",
    weight: 4,
    basePrice: 45,
    icon: "🧥"
  },
  {
    id: 14,
    name: "Верёвка",
    category: "craft",
    categoryName: "Ткани",
    weight: 3,
    basePrice: 20,
    icon: "🪢"
  },
  {
    id: 15,
    name: "Свечи",
    category: "craft",
    categoryName: "Ткани",
    weight: 1,
    basePrice: 15,
    icon: "🕯️"
  },
  {
    id: 16,
    name: "Посуда",
    category: "craft",
    categoryName: "Ткани",
    weight: 5,
    basePrice: 35,
    icon: "🏺"
  },
  {
    id: 17,
    name: "Стекло",
    category: "craft",
    categoryName: "Ткани",
    weight: 4,
    basePrice: 70,
    icon: "🪟"
  },
  {
    id: 18,
    name: "Бумага",
    category: "craft",
    categoryName: "Ткани",
    weight: 2,
    basePrice: 32,
    icon: "📜"
  },
  {
    id: 19,
    name: "Книги",
    category: "craft",
    categoryName: "Ткани",
    weight: 3,
    basePrice: 120,
    icon: "📚"
  },
  {
    id: 20,
    name: "Чернила",
    category: "craft",
    categoryName: "Ткани",
    weight: 1,
    basePrice: 55,
    icon: "🖋️"
  },

  {
    id: 21,
    name: "Древесина",
    category: "resource",
    categoryName: "Сырьё",
    weight: 10,
    basePrice: 18,
    icon: "🪵"
  },
  {
    id: 22,
    name: "Уголь",
    category: "resource",
    categoryName: "Сырьё",
    weight: 8,
    basePrice: 24,
    icon: "⚫"
  },
  {
    id: 23,
    name: "Железная руда",
    category: "resource",
    categoryName: "Сырьё",
    weight: 12,
    basePrice: 30,
    icon: "⛏️"
  },
  {
    id: 24,
    name: "Железо",
    category: "resource",
    categoryName: "Сырьё",
    weight: 8,
    basePrice: 65,
    icon: "⚒️"
  },
  {
    id: 25,
    name: "Медь",
    category: "resource",
    categoryName: "Сырьё",
    weight: 7,
    basePrice: 55,
    icon: "🟠"
  },
  {
    id: 26,
    name: "Серебро",
    category: "resource",
    categoryName: "Сырьё",
    weight: 2,
    basePrice: 180,
    icon: "🥈"
  },

  {
    id: 27,
    name: "Шёлк",
    category: "luxury",
    categoryName: "Роскошь",
    weight: 1,
    basePrice: 220,
    icon: "🧶"
  },
  {
    id: 28,
    name: "Пряности",
    category: "luxury",
    categoryName: "Роскошь",
    weight: 1,
    basePrice: 250,
    icon: "🌶️"
  },
  {
    id: 29,
    name: "Драгоценные камни",
    category: "luxury",
    categoryName: "Роскошь",
    weight: 0.5,
    basePrice: 500,
    icon: "💎"
  },
  {
    id: 30,
    name: "Благовония",
    category: "luxury",
    categoryName: "Роскошь",
    weight: 1,
    basePrice: 180,
    icon: "🪔"
  }
];
window.GOODS = GOODS;