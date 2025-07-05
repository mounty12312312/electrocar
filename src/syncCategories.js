// Вспомогательный скрипт для автоматической синхронизации категорий товаров с categorySpecs.js
const initialCatalog = require('./catalogData').default || require('./catalogData');
const categorySpecs = require('./categorySpecs').default || require('./categorySpecs');

// Получаем все возможные ключи категорий
const allCategoryKeys = Object.keys(categorySpecs).filter(k => Array.isArray(categorySpecs[k]));

// Функция поиска наиболее подходящего полного пути категории
function findFullCategoryPath(category) {
  if (allCategoryKeys.includes(category)) return category;
  // Пробуем найти по последнему слову (например, "Лампы" -> "Светотехника > Лампы")
  const last = category.split(' > ').pop();
  const found = allCategoryKeys.find(k => k.endsWith(last));
  return found || category;
}

const updatedCatalog = initialCatalog.map(product => ({
  ...product,
  category: findFullCategoryPath(product.category)
}));

// Для экспорта в основной проект
module.exports = updatedCatalog;

// Для быстрой проверки результата (можно удалить после применения)
console.log(updatedCatalog.map(p => p.category));

// --- Сохраняем обновлённый каталог в файл (перезапишет catalogData.js) ---
const fs = require('fs');
const path = require('path');
const outPath = path.join(__dirname, 'catalogData.js');
const fileContent = `// Каталог товаров для ElectroShop\n// Автоматически синхронизировано\n\nconst initialCatalog = ${JSON.stringify(updatedCatalog, null, 2)};\n\nexport default initialCatalog;\n`;
fs.writeFileSync(outPath, fileContent, 'utf8');
console.log('Категории товаров синхронизированы и сохранены в catalogData.js');
