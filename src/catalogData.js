// Каталог товаров для ElectroShop
// Автоматически синхронизировано
import categorySpecs from './categorySpecs';

function getSpecsTemplateForCategory(category, specs = []) {
  // Получаем список обязательных характеристик для категории (ищем по всем уровням)
  const parts = category.split(' > ');
  let required = [];
  for (let i = parts.length; i > 0; i--) {
    const path = parts.slice(0, i).join(' > ');
    if (categorySpecs[path] && categorySpecs[path].length) {
      required = categorySpecs[path].map(s => s.key);
      break;
    }
  }
  // Формируем карту существующих характеристик
  const map = {};
  (specs || []).forEach(s => { map[s.key] = s.value; });
  // Сначала обязательные (с value: 'н/д', если нет)
  const result = required.map(key => ({ key, value: map[key] !== undefined && map[key] !== '' ? map[key] : 'н/д' }));
  // Затем остальные, которых нет среди обязательных
  (specs || []).forEach(s => {
    if (!required.includes(s.key)) result.push({ key: s.key, value: s.value !== undefined && s.value !== '' ? s.value : 'н/д' });
  });
  return result;
}

const initialCatalog = [
  {
    "id": 1,
    "name": "Кабель силовой Test A",
    "category": "Кабель и провод > Кабель силовой",
    "price": 40,
    "description": "Пример товара для кабеля силового.",
    "image": "https://placehold.co/300x300?text=Кабель+силовой",
    "specs": getSpecsTemplateForCategory("Кабель и провод > Кабель силовой", [
      { "key": "Сечение", "value": "3х2.5 мм²" }
    ])
  },
  {
    "id": 2,
    "name": "Кабель монтажный Test B",
    "category": "Кабель и провод > Кабель монтажный",
    "price": 30,
    "description": "Пример монтажного кабеля.",
    "image": "https://placehold.co/300x300?text=Кабель+монтажный",
    "specs": getSpecsTemplateForCategory("Кабель и провод > Кабель монтажный", [
      { "key": "Сечение", "value": "2х1.5 мм²" }
    ])
  },
  {
    "id": 3,
    "name": "Провод Test C",
    "category": "Кабель и провод > Провода и шнуры",
    "price": 20,
    "description": "Пример провода.",
    "image": "https://placehold.co/300x300?text=Провод",
    "specs": getSpecsTemplateForCategory("Кабель и провод > Провода и шнуры", [
      { "key": "Сечение", "value": "1.5 мм²" }
    ])
  },
  {
    "id": 4,
    "name": "Провод для ЛЭП Test D",
    "category": "Кабель и провод > Провода для ЛЭП",
    "price": 50,
    "description": "Пример провода для ЛЭП.",
    "image": "https://placehold.co/300x300?text=Провод+ЛЭП",
    "specs": getSpecsTemplateForCategory("Кабель и провод > Провода для ЛЭП", [
      { "key": "Сечение", "value": "10 мм²" }
    ])
  },
  {
    "id": 5,
    "name": "Лоток перфорированный Test E",
    "category": "Прокладка кабеля > Лотки > Лотки перфорированные",
    "price": 60,
    "description": "Пример лотка перфорированного.",
    "image": "https://placehold.co/300x300?text=Лоток+перфорированный",
    "specs": getSpecsTemplateForCategory("Прокладка кабеля > Лотки > Лотки перфорированные", [
      { "key": "Размер", "value": "100x50 мм" }
    ])
  },
  {
    "id": 6,
    "name": "Лоток неперфорированный Test F",
    "category": "Прокладка кабеля > Лотки > Лотки неперфорированные",
    "price": 65,
    "description": "Пример лотка неперфорированного.",
    "image": "https://placehold.co/300x300?text=Лоток+неперфорированный",
    "specs": getSpecsTemplateForCategory("Прокладка кабеля > Лотки > Лотки неперфорированные", [
      { "key": "Размер", "value": "100x50 мм" }
    ])
  },
  {
    "id": 7,
    "name": "Шинопровод Test G",
    "category": "Прокладка кабеля > Шинопровод",
    "price": 120,
    "description": "Пример шинопровода.",
    "image": "https://placehold.co/300x300?text=Шинопровод",
    "specs": getSpecsTemplateForCategory("Прокладка кабеля > Шинопровод", [
      { "key": "Ток", "value": "100А" }
    ])
  },
  {
    "id": 8,
    "name": "Офисный светильник Test H",
    "category": "Светотехника > Светильники > Светильники для внутреннего освещения > Офисные светильники",
    "price": 200,
    "description": "Пример офисного светильника.",
    "image": "https://placehold.co/300x300?text=Офисный+светильник",
    "specs": getSpecsTemplateForCategory("Светотехника > Светильники > Светильники для внутреннего освещения > Офисные светильники", [
      { "key": "Мощность", "value": "36Вт" }
    ])
  },
  {
    "id": 9,
    "name": "Лампа Test I",
    "category": "Лампы",
    "price": 70,
    "description": "Пример светодиодной лампы.",
    "image": "https://placehold.co/300x300?text=Лампа",
    "specs": getSpecsTemplateForCategory("Лампы", [
      { "key": "Мощность", "value": "10Вт" }
    ])
  },
  {
    "id": 999,
    "name": "Тестовый товар с доп. характеристиками",
    "category": "Кабель и провод > Кабель силовой",
    "price": 123,
    "description": "Тест для проверки отображения характеристик (обязательные из categorySpecs.js + добавленные)",
    "image": "https://placehold.co/300x300?text=Тест+товар",
    "specs": getSpecsTemplateForCategory("Кабель и провод > Кабель силовой", [
      { "key": "Производитель", "value": "TestBrand" },
      { "key": "Марка", "value": "TestMark" },
      { "key": "Кол-во жил", "value": "7" },
      { "key": "Сечение жилы", "value": "5 мм²" },
      { "key": "Материал жилы", "value": "Медь" },
      { "key": "Цвет", "value": "Красный" },
      { "key": "Моя доп. характеристика 1", "value": "Значение 1" },
      { "key": "Моя доп. характеристика 2", "value": "Значение 2" },
      { "key": "Моя доп. характеристика 3", "value": "Значение 3" }
    ])
  },
  {
    "id": 666,
    "name": "Кабель монтажный Test 123",
    "category": "Кабель и провод > Кабель силовой",
    "price": 30,
    "description": "Пример монтажного кабеля.",
    "image": "https://placehold.co/300x300?text=Кабель+монтажный",
    "specs": getSpecsTemplateForCategory("Кабель и провод > Кабель силовой", [
      { "key": "Сечение", "value": "2х1.5 мм²" }
    ])
  }
]

export default initialCatalog;
