const TRANSPORTS = [
  {
    id: 1,
    name: "Осёл",
    capacity: 100,
    speed: 1.0,
    price: 0,
    description: "Надёжный спутник начинающего торговца."
  },
  {
    id: 2,
    name: "Мул",
    capacity: 180,
    speed: 0.95,
    price: 350,
    description: "Выносливее осла и способен перевозить больше груза."
  },
  {
    id: 3,
    name: "Лошадь",
    capacity: 250,
    speed: 1.25,
    price: 900,
    description: "Быстрее передвигается между городами."
  },
  {
    id: 4,
    name: "Повозка",
    capacity: 800,
    speed: 0.85,
    price: 3000,
    description: "Большая вместимость, но требует тягового животного."
  },
  {
    id: 5,
    name: "Торговый караван",
    capacity: 2000,
    speed: 0.75,
    price: 12000,
    description: "Мечта любого купца. Огромная грузоподъёмность и престиж."
  }
];
window.TRANSPORTS = TRANSPORTS;