window.EVENTS = [
  // ХОРОШИЕ (10)
  { type: 'good', text: "Вы нашли брошенный мешок с монетами!", effect: (p) => { p.gold += 100; return "Получено 100 золота"; } },
  { type: 'good', text: "Торговец угостил вас редким товаром.", effect: (p) => { p.inventoryCount = (p.inventoryCount || 0) + 2; return "Товаров стало больше"; } },
  { type: 'good', text: "Ваш мул нашел короткую дорогу, вы сэкономили время.", effect: (p) => { p.gold += 50; return "Получено 50 золота"; } },
  { type: 'good', text: "Удача! Вы выиграли в карты у случайного путника.", effect: (p) => { p.gold += 200; return "Получено 200 золота"; } },
  { type: 'good', text: "Богатый купец купил у вас товар по двойной цене.", effect: (p) => { p.gold += 300; return "Получено 300 золота"; } },
  { type: 'good', text: "Вы нашли редкий товар, выпавший из повозки.", effect: (p) => { p.inventoryCount = (p.inventoryCount || 0) + 5; return "Найдено 5 единиц товара"; } },
  { type: 'good', text: "Подарок судьбы: вы нашли старый клад.", effect: (p) => { p.gold += 500; return "Получено 500 золота"; } },
  { type: 'good', text: "Вам предложили обмен на новый транспорт!", effect: (p) => { 
      const list = window.TRANSPORTS || [];
      const randomT = list[Math.floor(Math.random() * list.length)];
      p.transport = { id: randomT.id, name: randomT.name, capacity: randomT.capacity, speed: randomT.speed };
      return `Теперь у вас: ${randomT.name}`; 
  }},
  { type: 'good', text: "Вы спасли караван и получили награду.", effect: (p) => { p.gold += 400; return "Получено 400 золота"; } },
  { type: 'good', text: "Успешная торговля, выручка превысила ожидания.", effect: (p) => { p.gold += 150; return "Получено 150 золота"; } },

  // ПЛОХИЕ (10)
  { type: 'bad', text: "Разбойники украли часть вашего золота!", effect: (p) => { const loss = Math.min(p.gold, 200); p.gold -= loss; return `Потеряно ${loss} золота`; } },
  { type: 'bad', text: "Грызуны прогрызли мешки с товаром.", effect: (p) => { const loss = Math.min(p.inventoryCount || 0, 3); p.inventoryCount -= loss; return `Потеряно ${loss} ед. товара`; } },
  { type: 'bad', text: "Поломалось колесо, ремонт стоил денег.", effect: (p) => { const loss = Math.min(p.gold, 100); p.gold -= loss; return `Потеряно ${loss} золота на ремонт`; } },
  { type: 'bad', text: "На вас напали, пришлось отдать все товары.", effect: (p) => { p.inventoryCount = 0; return "Все товары утеряны"; } },
  { type: 'bad', text: "Вас оштрафовали на пропускном пункте.", effect: (p) => { const loss = Math.min(p.gold, 50); p.gold -= loss; return `Штраф ${loss} золота`; } },
  { type: 'bad', text: "Дождь испортил товары.", effect: (p) => { const loss = Math.min(p.inventoryCount || 0, 2); p.inventoryCount -= loss; return `Потеряно ${loss} ед. товара`; } },
  { type: 'bad', text: "Потеряли кошелек сбережений.", effect: (p) => { const loss = Math.floor(p.gold * 0.2); p.gold -= loss; return `Потеряно ${loss} золота`; } },
  { type: 'bad', text: "У вас украли весь товар пока вы спали.", effect: (p) => { p.inventoryCount = 0; return "Товары украдены"; } },
  { type: 'bad', text: "Конь захромал, пришлось потратиться на ветеринара.", effect: (p) => { const loss = Math.min(p.gold, 150); p.gold -= loss; return `Потеряно ${loss} золота`; } },
  { type: 'bad', text: "Вы угодили в ловушку и отдали золото.", effect: (p) => { const loss = Math.min(p.gold, 300); p.gold -= loss; return `Потеряно ${loss} золота`; } },

  // НЕЙТРАЛЬНЫЕ (10)
  { type: 'neutral', text: "Вы встретили старого друга, долго беседовали.", effect: (p) => "Ничего не изменилось." },
  { type: 'neutral', text: "Дорога была тихой и спокойной.", effect: (p) => "Ничего не изменилось." },
  { type: 'neutral', text: "Вы засмотрелись на красивый закат.", effect: (p) => "Ничего не изменилось." },
  { type: 'neutral', text: "По пути вы встретили странствующего монаха.", effect: (p) => "Ничего не изменилось." },
  { type: 'neutral', text: "Нашли старую подкову на счастье.", effect: (p) => "Ничего не изменилось." },
  { type: 'neutral', text: "Переждали непогоду под деревом.", effect: (p) => "Ничего не изменилось." },
  { type: 'neutral', text: "Видели вдалеке пролетающего дракона.", effect: (p) => "Ничего не изменилось." },
  { type: 'neutral', text: "Поменяли маршрут из-за камнепада.", effect: (p) => "Ничего не изменилось." },
  { type: 'neutral', text: "Вспомнили интересную историю из детства.", effect: (p) => "Ничего не изменилось." },
  { type: 'neutral', text: "День прошел без происшествий.", effect: (p) => "Ничего не изменилось." }
];
