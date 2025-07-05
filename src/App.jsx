import React, { useState, useEffect } from 'react';
import initialCatalog from './catalogData';
import categorySpecs from './categorySpecs';

// === Жесткая привязка обязательных категорий к обязательным характеристикам ===
const REQUIRED_CATEGORY_SPECS = {
  "Кабель и провод > Кабель силовой": ["Сечение"],
  "Кабель и провод > Кабель монтажный": ["Сечение"],
  "Кабель и провод > Провода и шнуры": ["Сечение"],
  "Кабель и провод > Провода для ЛЭП": ["Сечение"],
  "Прокладка кабеля > Лотки > Лотки перфорированные": ["Размер"],
  "Прокладка кабеля > Лотки > Лотки неперфорированные": ["Размер"],
  "Прокладка кабеля > Шинопровод": ["Ток"],
  "Светотехника > Светильники > Светильники для внутреннего освещения > Офисные светильники": ["Мощность"],
  "Светотехника > Лампы": ["Мощность"],
  // ...добавьте остальные обязательные категории и их обязательные характеристики...
};

// === ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: Получение обязательных характеристик с учетом наследования ===
function getRequiredSpecsForCategory(categoryPath) {
  if (!categoryPath) return [];
  const parts = categoryPath.split(' > ');
  for (let i = parts.length; i > 0; i--) {
    const path = parts.slice(0, i).join(' > ');
    if (REQUIRED_CATEGORY_SPECS[path]) {
      return REQUIRED_CATEGORY_SPECS[path];
    }
  }
  return [];
}

// === Утилита для поиска характеристик по всем уровням категории ===
function getSpecsForCategory(categoryPath) {
  if (!categoryPath) return [];
  const parts = categoryPath.split(' > ');
  let result = [];
  for (let i = 1; i <= parts.length; i++) {
    const path = parts.slice(0, i).join(' > ');
    if (categorySpecs[path]) result = result.concat(categorySpecs[path]);
    else if (categorySpecs[parts[i-1]]) result = result.concat(categorySpecs[parts[i-1]]);
  }
  // Удаляем дубли по key
  const seen = new Set();
  return result.filter(spec => {
    if (seen.has(spec.key)) return false;
    seen.add(spec.key);
    return true;
  });
}

// Define a simple Footer component if it doesn't exist
function Footer() {
  return (
    <footer className="bg-gray-200 text-center py-4">
      <p className="text-sm text-gray-600">© 2023 ElectroShop. All rights reserved.</p>
    </footer>
  );
}

// Define a simple AboutPage component if it doesn't exist
function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">О нас</h1>
      <p className="text-gray-600 leading-relaxed">
        Добро пожаловать в ElectroShop! Мы предлагаем широкий ассортимент
        электрооборудования для вашего дома и офиса. Наша цель — предоставить
        качественные товары по доступным ценам.
      </p>
    </div>
  );
}

// Define a simple ContactPage component if it doesn't exist
function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Связаться</h1>
      <p className="text-gray-600 leading-relaxed">
        Если у вас есть вопросы, свяжитесь с нами по электронной почте: 
        <a href="mailto:support@electroshop.com" className="text-blue-600 hover:underline"> support@electroshop.com</a>.
      </p>
    </div>
  );
}

// Define a simple CartPage component if it doesn't exist
function CartPage({ cart, updateQuantity, total, removeFromCart, setShowOrder }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Корзина</h1>
      {cart.length === 0 ? (
        <p className="text-gray-600 text-center">Ваша корзина пуста.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-sm text-gray-600">Цена: {item.price} ₽</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">
                Общая сумма: <span className="text-blue-600">{total} ₽</span>
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-semibold shadow"
              onClick={() => setShowOrder(true)}
            >
              Оформить заказ
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function AdminPage({ catalogData, setCatalogData, resetCatalog }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    specs: [],
    image: '',
  });
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categoryInput, setCategoryInput] = useState(formData.category || '');
  const [imagePreview, setImagePreview] = useState('');

  // === Получить все возможные категории из CATEGORY_TREE ===
  function getAllCategories(tree, prefix = '') {
    let result = [];
    for (const node of tree) {
      const path = prefix ? prefix + ' > ' + node.name : node.name;
      if (node.children && node.children.length) {
        result = result.concat(getAllCategories(node.children, path));
      } else {
        result.push(path);
      }
    }
    return result;
  }
  const allCategories = getAllCategories(CATEGORY_TREE);

  useEffect(() => {
    setCategoryInput(formData.category || '');
  }, [formData.category]);

  // --- При выборе категории подставлять обязательные характеристики ---
  useEffect(() => {
    if (formData.category) {
      const required = getRequiredSpecsForCategory(formData.category);
      if (required.length > 0) {
        setFormData(prev => ({
          ...prev,
          specs: required.map(key => ({ key, value: '' })),
        }));
      }
    }
  }, [formData.category]);

  // --- При выборе категории подставлять все характеристики из дерева ---
  useEffect(() => {
    if (formData.category) {
      const allSpecs = getSpecsForCategory(formData.category);
      if (allSpecs.length > 0) {
        setFormData(prev => {
          // Сохраняем уже введённые значения по ключу
          const prevMap = {};
          (prev.specs || []).forEach(s => { prevMap[s.key] = s.value; });
          return {
            ...prev,
            specs: allSpecs.map(spec => ({ key: spec.key, value: prevMap[spec.key] || '' })),
          };
        });
      }
    }
  }, [formData.category]);

  const filteredCategories = allCategories.filter(cat =>
    cat.toLowerCase().includes(categoryInput.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "category") setCategoryInput(value);
  };

  // --- Загрузка фото ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, image: ev.target.result }));
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }],
    }));
  };

  const updateSpec = (index, field, value) => {
    const updatedSpecs = [...formData.specs];
    updatedSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specs: updatedSpecs }));
  };

  const removeSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price || !formData.description) {
      alert('Заполните все поля!');
      return;
    }
    if (editingProduct) {
      setCatalogData((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id ? { ...editingProduct, ...formData } : product
        )
      );
    } else {
      const newProduct = {
        id: Math.max(...catalogData.map((p) => p.id), 0) + 1,
        ...formData,
        price: parseFloat(formData.price),
        image: formData.image || 'https://placehold.co/300x300',
      };
      setCatalogData((prev) => [...prev, newProduct]);
    }
    setFormData({ name: '', category: '', price: '', description: '', specs: [], image: '' });
    setImagePreview('');
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setImagePreview(product.image || '');
  };

  const handleDelete = (id) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      setCatalogData((prev) => prev.filter((product) => product.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: '', description: '', specs: [], image: '' });
    setCategoryInput('');
    setImagePreview('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Управление каталогом</h1>
      {/* Добавить кнопку сброса каталога */}
      <button
        onClick={resetCatalog}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Сбросить и обновить каталог
      </button>
      {/* Form for adding/editing products */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Название"
            className="w-full border border-gray-300 rounded-lg p-2.5"
          />
          {/* Custom dropdown for category */}
          <div className="relative w-full">
            <input
              type="text"
              name="category"
              value={categoryInput}
              onChange={e => {
                setCategoryInput(e.target.value);
                setFormData(prev => ({ ...prev, category: e.target.value }));
                setCategoryDropdownOpen(true);
              }}
              onFocus={() => setCategoryDropdownOpen(true)}
              onBlur={() => setTimeout(() => setCategoryDropdownOpen(false), 120)}
              placeholder="Категория"
              autoComplete="off"
              className="w-full border border-gray-300 rounded-lg p-2.5"
            />
            {categoryDropdownOpen && filteredCategories.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                {filteredCategories.map((cat, idx) => (
                  <li
                    key={cat + idx}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                    onMouseDown={() => {
                      setCategoryInput(cat);
                      setFormData(prev => ({ ...prev, category: cat }));
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Цена"
            className="w-full border border-gray-300 rounded-lg p-2.5"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Описание"
            className="w-full border border-gray-300 rounded-lg p-2.5"
          />
          {/* --- Загрузка фото --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Фото товара</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Превью" className="mt-2 w-32 h-32 object-cover rounded-lg border" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Характеристики</h3>
            {formData.specs.map((spec, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => updateSpec(index, 'key', e.target.value)}
                  placeholder="Ключ"
                  className="w-1/2 border border-gray-300 rounded-lg p-2.5"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, 'value', e.target.value)}
                  placeholder="Значение"
                  className="w-1/2 border border-gray-300 rounded-lg p-2.5"
                />
                <button
                  onClick={() => removeSpec(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Удалить
                </button>
              </div>
            ))}
            <button
              onClick={addSpec}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Добавить характеристику
            </button>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {editingProduct ? 'Сохранить изменения' : 'Добавить товар'}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Отменить изменения
            </button>
          )}
        </div>
      </div>
      {/* Table for viewing/editing/deleting products */}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left text-gray-800">Название</th>
            <th className="px-4 py-2 text-left text-gray-800">Категория</th>
            <th className="px-4 py-2 text-left text-gray-800">Цена</th>
            <th className="px-4 py-2 text-left text-gray-800">Действия</th>
          </tr>
        </thead>
        <tbody>
          {catalogData.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{product.category}</td>
              <td className="px-4 py-2">{product.price} ₽</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Update App to include AdminPage
export default function App() {
  const PAGE_SIZE = 16;

  // Инициализируем catalogData напрямую из импортированного initialCatalog
  const [catalogData, setCatalogData] = useState(initialCatalog);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingCatalog, setEditingCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [specFilters, setSpecFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchCategoryFilter, setSearchCategoryFilter] = useState('');

  // Авторизация
  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');
  const [registerError, setRegisterError] = React.useState('');

  // ==== Пользователи ====
  function getUsers() {
    return [
      {
        username: 'kateh',
        password: 'loveyou',
        name: 'Администратор',
        role: 'админ',
      },
    ];
  }
  function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // --- состояния для заказов и модалки ---
  const [showOrder, setShowOrder] = React.useState(false);
  const [orderLoading, setOrderLoading] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const [orders, setOrders] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('orders')) || [];
    } catch {
      return [];
    }
  });

  // --- обработка оформления заказа с отправкой в Telegram ---
  function handleOrderSubmit(orderData) {
    setOrderLoading(true);
    // --- Формируем сообщение для Telegram ---
    const tgToken = '7419050616:AAGhybYGXOS_PBzNNTuWcN8bYQ5uD3bVS68'; // TODO: заменить на реальный токен
    const tgChatId = '7545991724';    // TODO: заменить на реальный chat_id
    const itemsText = cart.map(i => `- ${i.name} — ${i.quantity} шт. × ${i.price} ₽`).join('\n');
    const legalText = orderData.isLegalEntity ? 'Да' : 'Нет';
    const orgInnText = orderData.isLegalEntity && orderData.orgInn ? `Организация/ИНН: ${orderData.orgInn}\n` : '';
    const msg =
      `Новый заказ!\n` +
      `ФИО: ${orderData.name}\n` +
      `Телефон: ${orderData.phone}\n` +
      `Адрес: ${orderData.address}\n` +
      (orderData.comment ? `Комментарий: ${orderData.comment}\n` : '') +
      `Юридическое лицо/ИП: ${legalText}\n` +
      orgInnText +
      `Состав заказа:\n${itemsText}\n` +
      `Сумма: ${cart.reduce((sum, i) => sum + i.price * i.quantity, 0)} ₽`;

    // --- Отправка в Telegram ---
    fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: tgChatId,
        text: msg
      })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.ok) throw new Error('Ошибка отправки в Telegram');
        // --- если успех, сохраняем заказ ---
        setOrderLoading(false);
        setShowOrder(false);
        setOrderSuccess(true);
        const newOrder = {
          username: user?.username,
          name: orderData.name,
          phone: orderData.phone,
          address: orderData.address,
          comment: orderData.comment,
          isLegalEntity: orderData.isLegalEntity,
          orgInn: orderData.orgInn, // Добавлено поле организации/ИНН
          // payment: orderData.payment, // убрано, т.к. оплаты нет
          items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          total: cart.reduce((sum, i) => sum + i.price + i.quantity, 0),
          date: new Date().toLocaleString('ru-RU'),
        };
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setCart([]);
        localStorage.setItem('cart', '[]');
        setTimeout(() => setOrderSuccess(false), 3000);
      })
      .catch(err => {
        setOrderLoading(false);
        alert('Не удалось отправить заказ исполнителю в Telegram. Попробуйте позже.');
      });
  }

  // Оставляем useEffect для сохранения изменений, внесенных через админ-панель, в localStorage
  useEffect(() => {
    localStorage.setItem('catalog', JSON.stringify(catalogData));
  }, [catalogData]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Сохраняем user в localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // ==== Все уникальные категории ====
  const allCategories = [...new Set(catalogData.map(p => p.category))];

  // ==== Поиск по сайту (названия и характеристики) ====
  // (searchQuery уже есть в состоянии)

  // ==== Уникальные ключи характеристик ====
  const specKeys = [];
  const tempKeys = {};
  const source = categoryFilter
    ? catalogData.filter(p => p.category === categoryFilter)
    : catalogData;

  for (let i = 0; i < source.length; i++) {
    const product = source[i];
    const specs = product.specs || [];
    for (let j = 0; j < specs.length; j++) {
      const key = specs[j].key;
      if (key && !tempKeys[key]) {
        specKeys.push(key);
        tempKeys[key] = true;
      }
    }
  }

  // ==== Значения характеристик ====
  const getSpecValues = (key) => {
    const values = [];
    const seen = {};
    // Use the filtered source data for relevant spec values
    const currentSource = categoryFilter
      ? catalogData.filter(p => p.category === categoryFilter)
      : catalogData;

    for (let i = 0; i < currentSource.length; i++) {
      const specs = currentSource[i].specs || [];
      for (let j = 0; j < specs.length; j++) {
        if (specs[j].key === key && !seen[specs[j].value]) {
          values.push(specs[j].value);
          seen[specs[j].value] = true;
        }
      }
    }
    return values;
  };

  // ==== Изменение количества ====
  const updateQuantity = (id, delta) => {
    setCart(prevCart => {
      const updated = prevCart
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0);
      return updated;
    });
  };

  // ==== Получить количество товара в корзине ====
  const getQuantityInCart = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // ==== Применить фильтры ====
  const applyFilters = () => {
    if (!searchQuery && !categoryFilter && Object.values(specFilters).every(arr => !arr.length)) {
      return catalogData;
    }
    const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    // [Change] Modify applyFilters to use activeCategory from either searchCategoryFilter or categoryFilter:
    const activeCategory = searchQuery ? searchCategoryFilter : categoryFilter;
    return catalogData.filter(product => {
      const haystack = [
        product.name,
        ...(product.specs || []).flatMap(spec => [spec.key, spec.value])
      ].join(' ').toLowerCase();
      const matchesSearch = searchWords.length === 0 || searchWords.every(word => haystack.includes(word));
      const matchesCategory = activeCategory ? product.category === activeCategory : true;
      let matchesSpecs = true;
      for (const key in specFilters) {
        const selected = specFilters[key];
        if (selected.length > 0) {
          const productSpecValues = product.specs?.filter(s => s.key === key).map(s => s.value) || [];
          const hasMatchingSpec = selected.some(selectedValue => productSpecValues.includes(selectedValue));
          if (!hasMatchingSpec) {
            matchesSpecs = false;
            break;
          }
        }
      }
      return matchesSearch && matchesCategory && matchesSpecs;
    });
  };

  const filteredProducts = applyFilters();

  // ==== Добавление товара в корзину ====
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // ==== Удаление из корзины ====
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // ==== Общая сумма ====
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ==== Переключатель страниц ====
  const [currentHash, setCurrentHash] = useState(() => {
    // Если нет hash, открываем главную страницу
    const hash = window.location.hash.slice(1);
    return hash ? hash : 'main';
  });

  // Если пользователь начинает вводить в поиске, автоматически открываем каталог
  useEffect(() => {
    if (searchQuery && currentHash !== 'home') {
      window.location.hash = 'home';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash.slice(1) || 'main');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // --- добавляем процедуру сброса каталога ---
  function resetCatalog() {
    localStorage.removeItem('catalog');
    setCatalogData(initialCatalog);
    window.location.reload();
  }
  // --- конец добавления ---

  // --- ПРОВЕРКА ДАННЫХ НА ВХОДЕ: логируем обязательные характеристики для всех товаров ---
  useEffect(() => {
    catalogData.forEach(product => {
      const req = getRequiredSpecsForCategory(product.category);
      // eslint-disable-next-line no-console
      console.debug('Product:', product.name, '| Category:', product.category, '| Required specs:', req);
    });
  }, [catalogData]);

  // Для отладки: выводим весь catalogData при каждом рендере
  useEffect(() => {
    console.log('catalogData (products on site):', catalogData);
  }, [catalogData]);

  // ==== МОДАЛЬНОЕ ОКНО ЛОГИНА ====
  function LoginModal({ onLogin, onClose, error, registerButton }) {

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xs relative" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown} tabIndex={0}>
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
          <h2 className="text-xl font-bold mb-4 text-blue-700">Вход</h2>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
          />
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <button
            onClick={() => onLogin(username, password)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >Войти</button>
          {registerButton}
        </div>
      </div>
    );
  }

  // ==== МОДАЛЬНОЕ ОКНО РЕГИСТРАЦИИ ====
  function RegisterModal({ onRegister, onClose, error }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    // Роль не выбирается, всегда 'покупатель'

    React.useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Добавляем обработчик Enter
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onRegister({ username, password, name });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xs relative" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown} tabIndex={0}>
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
          <h2 className="text-xl font-bold mb-4 text-blue-700">Регистрация</h2>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
          />
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
          />
          {/* select для роли убран */}
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <button
            onClick={() => onRegister({ username, password, name })}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >Зарегистрироваться</button>
        </div>
      </div>
    );
  }

  // Функция логина
  function handleLogin(username, password) {
    const users = getUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('user', JSON.stringify(found));
      setShowLogin(false);
      setLoginError('');
    } else {
      setLoginError('Неверный логин или пароль');
    }
  }
  // Функция регистрации
  function handleRegister({ username, password, name }) {
    if (!username || !password || !name) {
      setRegisterError('Заполните все поля');
      return;
    }
    const users = getUsers();
    if (users.some(u => u.username === username)) {
      setRegisterError('Пользователь с таким логином уже существует');
      return;
    }
    const newUser = { username, password, name, role: 'покупатель' };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setShowRegister(false);
    setRegisterError('');
    setShowLogin(false);
    setLoginError('');
  }
  // Функция выхода
  function handleLogout() {
    setUser(null);
    localStorage.removeItem('user');
  }

  // ==== Шапка сайта ====
  function Header({ totalAmount, user, onLogin, onLogout }) {
    const goTo = (page) => {
      window.location.hash = page;
    };
    return (
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => goTo('main')}
              className="text-2xl font-extrabold text-blue-700 tracking-tight hover:underline focus:outline-none"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              aria-label="На главную"
            >
              ElectroShop
            </button>
          </div>
          <nav className="flex space-x-2 md:space-x-6 items-center">
            <button
              onClick={() => {
                goTo('home');
                window.dispatchEvent(new CustomEvent('reset-category-path'));
              }}
              className="font-medium text-gray-600 hover:text-blue-600 transition"
            >
              Каталог
            </button>
            <button onClick={() => goTo('about')} className="font-medium text-gray-600 hover:text-blue-600 transition">О нас</button>
            <button onClick={() => goTo('contact')} className="font-medium text-gray-600 hover:text-blue-600 transition">Связаться</button>
            <button onClick={() => goTo('cart')} className="relative font-medium text-gray-600 hover:text-blue-600 transition">
              Корзина
              {totalAmount > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {totalAmount}
                </span>
              )}
            </button>
            {user && (
              <button onClick={() => goTo('orders')} className="font-medium text-gray-600 hover:text-blue-600 transition">Мои заказы</button>
            )}
            {/* === Кнопка админ-панели только для админа === */}
            {user?.role === 'админ' && (
              <button
                onClick={() => goTo('kateh')}
                className="font-medium text-red-600 hover:text-red-800 transition border border-red-200 rounded px-3 py-1 ml-2"
              >
                Админ-панель
              </button>
            )}
            {/* === Авторизация === */}
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-gray-700 text-sm font-semibold">
                  {user.name}
                  {user.role !== 'покупатель' && (
                    <> ({user.role})</>
                  )}
                </span>
                <button
                  onClick={onLogout}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                >Выйти</button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >Войти</button>
            )}
          </nav>
        </div>
      </header>
    );
  }

  // --- Вставляем LoginModal и RegisterModal ---
  return (
    <>
      {showLogin && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => { setShowLogin(false); setLoginError(''); }}
          error={loginError}
          registerButton={<button className="mt-2 w-full px-4 py-2 bg-gray-200 text-blue-700 rounded-lg hover:bg-gray-300 font-semibold" onClick={() => { setShowLogin(false); setShowRegister(true); setLoginError(''); }}>Регистрация</button>}
        />
      )}
      {showRegister && (
        <RegisterModal
          onRegister={handleRegister}
          onClose={() => { setShowRegister(false); setRegisterError(''); }}
          error={registerError}
        />
      )}
      {/* Ниже — основной switch по currentHash, не трогаем */}
      {(() => {
        switch (currentHash) {
          case 'main':
            return (
              <div className="bg-gray-100 min-h-screen font-sans">
                <Header totalAmount={totalAmount} user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout} />
                <MainPage />
              </div>
            );
          case 'home':
            return (
              <div className="bg-gray-100 min-h-screen font-sans">
                <Header totalAmount={totalAmount} user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout} />
                <HomePage
                  products={filteredProducts}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  searchCategoryFilter={searchCategoryFilter}
                  setSearchCategoryFilter={setSearchCategoryFilter}
                  categories={allCategories}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                  addToCart={addToCart}
                  cart={cart}
                  updateQuantity={updateQuantity}
                  getQuantityInCart={getQuantityInCart}
                  specKeys={specKeys}
                  setSpecFilters={setSpecFilters}
                  specFilters={specFilters}
                  getSpecValues={getSpecValues}
                />
              </div>
            );
          case 'about':
            return (
              <div className="bg-gray-100 min-h-screen font-sans">
                <Header totalAmount={totalAmount} user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout} />
                <AboutPage />
              </div>
            );
          case 'contact':
            return (
              <div className="bg-gray-100 min-h-screen font-sans">
                <Header totalAmount={totalAmount} user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout} />
                <ContactPage />
              </div>
            );
          case 'cart':
            return (
              <div className="bg-gray-100 min-h-screen font-sans">
                <Header totalAmount={totalAmount} user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout} />
                <CartPage
                  cart={cart}
                  updateQuantity={updateQuantity}
                  total={totalAmount}
                  removeFromCart={removeFromCart}
                  setShowOrder={setShowOrder}
                />
              </div>
            );
          case 'kateh':
            return (
              <div className="bg-gray-100 min-h-screen font-sans">
                <Header totalAmount={totalAmount} user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout} />
                {user?.role === 'админ' ? (
                  <AdminPage catalogData={catalogData} setCatalogData={setCatalogData} resetCatalog={resetCatalog} />
                ) : (
                  <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-xl shadow text-center text-xl text-red-600 font-semibold">
                    Доступ к админ-панели разрешён только администратору.
                  </div>
                )}
              </div>
            );
          case 'orders':
            return (
              <div className="bg-gray-100 min-h-screen font-sans">
                <Header totalAmount={totalAmount} user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout} />
                <OrdersPage orders={orders} user={user} />
              </div>
            );
          default:
            return (
              <div className="bg-gray-100 min-h-screen font-sans">
                <Header totalAmount={totalAmount} user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout} />
                <MainPage />
              </div>
            );
        }
      })()}
      {/* ВАЖНО: Не используйте showOrder, orderSuccess, orderLoading вне компонента App! */}
      {/* Все состояния должны использоватьаться только внутри App и его потомков через пропсы. */}
      {showOrder && (
        <OrderModal
          onClose={() => setShowOrder(false)}
          onSubmit={handleOrderSubmit}
          loading={orderLoading}
        />
      )}
      {orderSuccess && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-lg font-semibold">
          Заказ успешно оформлен!
        </div>
      )}
    </>
  );
}

// ==== Строка поиска под хедером ====
function SiteSearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Поиск по сайту (название или характеристика)..."
          className="w-full max-w-xl border border-gray-300 rounded-lg p-2.5"
        />
      </div>
    </div>
  );
}

// ==== Главная страница ====
const MemoizedProductCard = React.memo(ProductCard);

function HomePage({
  products,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  searchCategoryFilter,
  setSearchCategoryFilter,
  categories,
  showFilters,
  setShowFilters,
  selectedProduct,
  setSelectedProduct,
  addToCart,
  cart,
  updateQuantity,
  getQuantityInCart,
  specKeys,
  setSpecFilters,
  specFilters,
  getSpecValues
}) {
  // Import useState directly
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [specs, setSpecs] = useState([]);

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const updateSpec = (index, field, value) => {
    const updated = specs.slice();
    updated[index][field] = value;
    setSpecs(updated);
  };

  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const saveNewProduct = () => {
    if (!name || !category || !price || !description) {
      alert("Заполните все поля");
      return;
    }

    const newProduct = {
      id: Math.max(...catalogData.map(p => p.id), 0) + 1,
      name,
      category,
      price: parseFloat(price),
      description,
      image: "https://placehold.co/300x300",
      specs: specs.filter(s => s.key && s.value)
    };

    setCatalogData([...catalogData, newProduct]);
    setName('');
    setCategory('');
    setPrice('');
    setDescription('');
    setSpecs([]);
    setEditingCatalog(false);
  };

  // Закрытие фильтра и модального окна по ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showFilters) setShowFilters(false);
        if (selectedProduct) setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showFilters, setShowFilters, selectedProduct, setSelectedProduct]);

  // Пагинация
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Сброс страницы при изменении фильтров/поиска
  useEffect(() => {
    setPage(1);
  }, [products.length]);

  // Состояние для "показать все" по каждому ключу характеристик
  const [showAllSpecs, setShowAllSpecs] = useState({});

  // === Категорийная навигация ===
  const [categoryPath, setCategoryPath] = useState([]);

  // Сброс при поиске или фильтрах
  useEffect(() => {
    // if (searchQuery) setCategoryPath([]);
  }, [searchQuery]);

  // Сброс при нажатии на "Каталог"
  useEffect(() => {
    const resetHandler = () => setCategoryPath([]);
    window.addEventListener('reset-category-path', resetHandler);
    return () => window.removeEventListener('reset-category-path', resetHandler);
  }, []);

  // Получить текущий уровень категорий для выбора
  function getCurrentCategories() {
    let level = CATEGORY_TREE;
    for (const cat of categoryPath) {
      const found = (level || []).find(c => c.name === cat);
      if (found && found.children) {
        level = found.children;
      } else {
        level = [];
        break;
      }
    }
    return level;
  }

  // Если не выбран самый глубокий уровень, показываем только категории/подкатегории
  const currentCategories = getCurrentCategories();
  const isCategorySelection = !searchQuery && currentCategories.length > 0;
  const isDeepCategory = !searchQuery && currentCategories.length === 0 && categoryPath.length > 0;

  // Сохраняем категории, подходящие под текущий поисковый запрос (по всему каталогу)
  const [searchCategories, setSearchCategories] = useState([]);

  // При новом поиске сохраняем категории из результатов поиска по всему каталогу
  useEffect(() => {
    if (searchQuery) {
      // Поиск по всему каталогу, а не по products (products уже отфильтрованы)
      const allProducts = categories.length
        ? categories.reduce((acc, cat) => acc.concat(products.filter(p => p.category === cat)), [])
        : products;
      const searchWords = searchQuery
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      const matched = allProducts.filter(product => {
        const haystack = [
          product.name,
          ...(product.specs || []).flatMap(spec => [spec.key, spec.value])
        ].join(' ').toLowerCase();
        return searchWords.every(word => haystack.includes(word));
      });
      setSearchCategories([...new Set(matched.map(p => p.category))]);
    } else {
      setSearchCategories([]);
    }
  }, [searchQuery, categories, products]);

  // Для фильтра: если поиск, то показываем только категории из результатов поиска
  // Категории не сбрасываются при выборе, пользователь может переключаться между ними
  let filterCategories = categories;

  // При выборе категории/подкатегории
  function handleCategoryCardClick(catName) {
    const newPath = [...categoryPath, catName];
    setCategoryPath(newPath);
    if (searchQuery) {
      setSearchCategoryFilter(newPath.join(' > '));
    } else {
      setCategoryFilter(newPath.join(' > '));
    }
    setSpecFilters({});
  }

  // Кнопка "назад" по категориям
  function handleCategoryBack() {
    const newPath = categoryPath.slice(0, -1);
    setCategoryPath(newPath);
    setCategoryFilter(newPath.join(' > ') || '');
    setSpecFilters({});
  }

  // Сброс фильтра: во время поиска сбрасываем характеристики и выставляем "все категории"
  // Для каталога (без поиска) сбрасываем только характеристики
  function handleResetFilters() {
    setSpecFilters({});
    setShowAllSpecs({});
    setShowFilters(false);
    if (searchQuery) {
      setCategoryFilter('');
    }
    // searchQuery не трогаем, чтобы остался поиск
  }

  if (isCategorySelection) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* [Change] Add clickable breadcrumb navigation */}
        {categoryPath.length > 0 && (
          <nav className="mb-4">
            <ol className="flex space-x-2 text-sm text-blue-600">
              <li
                onClick={() => {
                  setCategoryPath([]);
                  setCategoryFilter('');
                  setSearchCategoryFilter('');
                }}
                className="cursor-pointer hover:underline"
              >
                Каталог
              </li>
              {categoryPath.map((cat, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="mx-2">/</span>
                  <span
                    onClick={() => {
                      const newPath = categoryPath.slice(0, idx + 1);
                      setCategoryPath(newPath);
                      setCategoryFilter(newPath.join(' > '));
                      setSearchCategoryFilter(newPath.join(' > '));
                    }}
                    className="cursor-pointer hover:underline"
                  >
                    {cat}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {categoryPath.length > 0 && (
          <button
            onClick={handleCategoryBack}
            className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700"
          >
            ← Назад
          </button>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentCategories.map(cat => (
            <div
              key={cat.name}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-200 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full border border-gray-200 cursor-pointer"
              onClick={() => handleCategoryCardClick(cat.name)}
              tabIndex={0}
              style={{ willChange: 'transform, box-shadow' }}
            >
              <div className="flex flex-col items-center justify-center flex-grow p-8">
                <span className="text-xl font-bold text-blue-700 mb-2">{cat.name}</span>
                {cat.children && <span className="text-gray-500 text-sm">Выберите подкатегорию</span>}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // In the non-isCategorySelection branch (deep category view), add breadcrumb above the filter button:
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {!selectedProduct && categoryPath.length > 0 && (
        <nav className="mb-4">
          <ol className="flex space-x-2 text-sm text-blue-600">
            <li
              onClick={() => {
                setCategoryPath([]);
                setCategoryFilter('');
                setSearchCategoryFilter('');
              }}
              className="cursor-pointer hover:underline"
            >
              Каталог
            </li>
            {categoryPath.map((cat, idx) => (
              <li key={idx} className="flex items-center">
                <span className="mx-2">/</span>
                <span
                  onClick={() => {
                    const newPath = categoryPath.slice(0, idx + 1);
                    setCategoryPath(newPath);
                    setCategoryFilter(newPath.join(' > '));
                    setSearchCategoryFilter(newPath.join(' > '));
                  }}
                  className="cursor-pointer hover:underline"
                >
                  {cat}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowFilters(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-medium"
        >
          Показать фильтры
        </button>
      </div>
      {/* Модальное окно фильтра */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl mt-24 w-full max-w-xs p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              aria-label="Закрыть фильтр"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-5 text-blue-800">Фильтры</h3>
            {/* Категория: показываем только если не в глубокой категории */}
            {!isDeepCategory && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                <select
                  value={searchQuery ? searchCategoryFilter : categoryFilter}
                  onChange={e => {
                    if (searchQuery) {
                      setSearchCategoryFilter(e.target.value);
                    } else {
                      setCategoryFilter(e.target.value);
                    }
                    setSpecFilters({});
                    setShowAllSpecs({});
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Все категории</option>
                  {filterCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Характеристики */}
            {categoryFilter && specKeys.map(key => {
              const values = getSpecValues(key);
              const showAll = showAllSpecs[key];
              const visibleValues = showAll ? values : values.slice(0, 3);
              return (
                <div key={key} className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{key}</label>
                  <div className="space-y-2">
                    {visibleValues.map(value => (
                      <label key={value} className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition">
                        <input
                          type="checkbox"
                          checked={specFilters[key]?.includes(value) || false}
                          onChange={e => {
                            const current = specFilters[key] || [];
                            const updated = e.target.checked
                              ? [...current, value]
                              : current.filter(v => v !== value);
                            setSpecFilters({ ...specFilters, [key]: updated });
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                  {values.length > 3 && (
                    <button
                      type="button"
                      className="mt-2 text-blue-600 hover:underline text-sm"
                      onClick={() => setShowAllSpecs(prev => ({ ...prev, [key]: !prev[key] }))}
                    >
                      {showAll ? "Скрыть" : "Показать все"}
                    </button>
                  )}
                </div>
              );
            })}

            {/* Кнопка сброса */}
            <button
              onClick={handleResetFilters}
              className="mt-6 w-full px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      )}

      {/* Каталог с пагинацией */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedProducts.map(product => {
          const quantityInCart = getQuantityInCart(product.id);
          return (
            <MemoizedProductCard
              key={product.id}
              product={product}
              onSelect={() => setSelectedProduct(product)}
              quantityInCart={quantityInCart}
              onAdd={() => addToCart(product)}
              onDecrement={() => updateQuantity(product.id, -1)}
              onIncrement={() => updateQuantity(product.id, 1)}
            />
          );
        })}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Назад
          </button>
          <span>
            Страница {page} из {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Вперед
          </button>
        </div>
      )}

      {/* Модальное окно характеристик */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}

// ==== Карточка товара ====
function ProductCard({ product, onSelect, quantityInCart, onAdd, onDecrement, onIncrement }) {
  // Мемоизация обработчиков для предотвращения лишних рендеров
  const handleSelect = React.useCallback(() => onSelect(product), [onSelect, product]);
  const handleAdd = React.useCallback((e) => { e.stopPropagation(); onAdd(product); }, [onAdd, product]);
  const handleDecrement = React.useCallback((e) => { e.stopPropagation(); onDecrement(product); }, [onDecrement, product]);
  const handleIncrement = React.useCallback((e) => { e.stopPropagation(); onIncrement(product); }, [onIncrement, product]);

  // Получаем список обязательных характеристик для категории (как в ProductSpecifications)
  const requiredSpecsList = categorySpecs[product.category] || [];
  const productSpecsMap = {};
  (product.specs || []).forEach(s => { productSpecsMap[s.key] = s.value; });

  // Формируем массив обязательных характеристик (с плейсхолдером 'н/д')
  const requiredList = requiredSpecsList.map(spec => ({
    key: spec.key,
    value: productSpecsMap[spec.key] !== undefined && productSpecsMap[spec.key] !== '' ? productSpecsMap[spec.key] : 'н/д'
  }));
  // Дополнительные характеристики (не обязательные)
  const additionalList = (product.specs || [])
    .filter(s => !requiredSpecsList.some(rs => rs.key === s.key))
    .map(s => ({ key: s.key, value: s.value !== undefined && s.value !== '' ? s.value : 'н/д' }));

  // Сначала обязательные, затем дополнительные (до 3-х всего)
  let visibleSpecs = [];
  if (requiredList.length >= 3) {
    visibleSpecs = requiredList.slice(0, 3);
  } else {
    visibleSpecs = [
      ...requiredList,
      ...additionalList.slice(0, 3 - requiredList.length)
    ];
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-200 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full border border-gray-200 cursor-pointer"
      onClick={() => onSelect(product)}
      tabIndex={0}
      style={{ willChange: 'transform, box-shadow' }}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover bg-gray-50"
      />
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
          <span className="text-blue-700 font-bold text-xl">{product.price} ₽</span>
          <ul className="mt-2 text-gray-700 text-sm space-y-1">
            {visibleSpecs.map((spec, idx) => (
              <li key={idx}>
                <strong>{spec.key}:</strong> {spec.value}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex items-center justify-end space-x-2">
          {quantityInCart > 0 ? (
            <>
              <button
                onClick={e => { e.stopPropagation(); onDecrement(product); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-150 text-lg font-semibold"
              >-</button>
              <span className="w-8 text-center font-semibold text-gray-800">{quantityInCart}</span>
              <button
                onClick={e => { e.stopPropagation(); onIncrement(product); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-150 text-lg font-semibold"
              >+</button>
            </>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); onAdd(product); }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-150 font-medium"
            >
              В корзину
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==== Компонент характеристик товара ====
function ProductSpecifications({ specs, category }) {
  // Обязательные: только те, что есть в categorySpecs.js для этой категории
  const requiredSpecsList = categorySpecs[category] || [];
  const productSpecsMap = {};
  (specs || []).forEach(s => { productSpecsMap[s.key] = s.value; });

  // Обязательные: всегда выводим все из categorySpecs.js, даже если их нет в товаре (тогда value = 'н/д')
  const requiredSpecs = requiredSpecsList.map(spec => ({
    key: spec.key,
    value: productSpecsMap[spec.key] !== undefined && productSpecsMap[spec.key] !== '' ? productSpecsMap[spec.key] : 'н/д',
    unit: spec.unit || ''
  }));
  // Дополнительные: только те, которых нет в categorySpecs.js
  const additionalSpecs = (specs || [])
    .filter(s => !requiredSpecsList.some(rs => rs.key === s.key))
    .map(s => ({ key: s.key, value: s.value, unit: '' }));

  // Итоговый массив: сначала обязательные, затем дополнительные
  const allSpecs = [...requiredSpecs, ...additionalSpecs];

  const [showAll, setShowAll] = React.useState(false);
  let visibleSpecs;
  if (showAll) {
    visibleSpecs = allSpecs;
  } else if (requiredSpecs.length >= 3) {
    visibleSpecs = requiredSpecs.slice(0, 3);
  } else {
    visibleSpecs = [
      ...requiredSpecs,
      ...additionalSpecs.slice(0, 3 - requiredSpecs.length)
    ];
  }

  return (
    <div className="max-h-32 overflow-y-auto">
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {visibleSpecs.map((spec, idx) => (
          <li key={idx}><b>{spec.key}:</b> {spec.value}{spec.unit ? ` ${spec.unit}` : ''}</li>
        ))}
      </ul>
      {allSpecs.length > 3 && (
        <button className="text-blue-600 text-xs mt-1" onClick={() => setShowAll(v => !v)}>
          {showAll ? 'Скрыть' : 'Показать все'}
        </button>
      )}
    </div>
  );
}

// ==== Модальное окно товара ====
function ProductModal({ product, onClose }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullSpecs, setShowFullSpecs] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
        >
          &times;
        </button>
        {/* Make the whole modal scrollable except the close button */}
        <div className="flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover rounded-t-lg"
          />
        </div>
        <div className="flex-grow min-h-0 overflow-y-auto p-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">{product.name}</h3>
          <div className="space-y-4">
            {/* Description Section */}
            <div>
              <p className="font-semibold text-gray-800 mb-2">Описание:</p>
              <p className="text-gray-700">
                {showFullDescription || product.description.length <= 200
                  ? product.description
                  : `${product.description.slice(0, 200)}...`}
              </p>
              {product.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  {showFullDescription ? "Скрыть все" : "Показать все"}
                </button>
              )}
            </div>
            {/* Specifications Section */}
            <div>
              <p className="font-semibold text-gray-800 mb-2">Характеристики:</p>
              <ProductSpecifications specs={product.specs} category={product.category} />
            </div>
          </div>
          <p className="mt-4 text-xl font-bold text-blue-700">Цена: {product.price} ₽</p>
        </div>
      </div>
    </div>
  );
}

// ==== Главная страница сайта (отдельно от каталога) ====
function MainPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6">ElectroShop</h1>
        <p className="text-lg text-gray-700 mb-4 max-w-2xl">
          Добро пожаловать в ElectroShop — ваш универсальный магазин электротоваров для дома и офиса!
        </p>
        <img
          src="https://placehold.co/600x250?text=ElectroShop"
          alt="ElectroShop"
          className="rounded-xl shadow-lg mb-8"
        />
        <div className="text-gray-600 max-w-xl">
          <p className="mb-2">
            У нас вы найдете лампочки, розетки, кабели и многое другое по выгодным ценам.
          </p>
          <p className="mb-2">
            Быстрая доставка, удобный поиск и качественный сервис — всё для вашего комфорта.
          </p>
          <p>
            Начните покупки прямо сейчас — перейдите в <span className="font-semibold text-blue-700">Каталог</span>!
          </p>
        </div>
      </div>
    </div>
  );
}

// === Категории и подкатегории ===
const CATEGORY_TREE = [
  {
    name: "Кабель и провод",
    code: "1K",
    children: [
      { name: "Кабель силовой", code: "1KS" },
      { name: "Кабель монтажный", code: "1KM" },
      { name: "Провода и шнуры", code: "1KP" },
      { name: "Провода для ЛЭП", code: "1KL" },
    ],
  },
  {
    // TODO: Переименовать "Прокладка кабеля" в будущем
    name: "Прокладка кабеля",
    code: "2L",
    children: [
      {
        name: "Лотки",
        code: "2LL",
        children: [
          { name: "Лотки перфорированные", code: "2LLP" },
          { name: "Лотки неперфорированные", code: "2LLN" },
          { name: "Лотки лестничные", code: "2LLL" },
        ],
      },
      { name: "Шинопровод", code: "2LH" },
      { name: "Распределительные коробки", code: "2LK" },
      { name: "Разьемы", code: "2LR" },
    ],
  },
  {
    name: "Светотехника",
    code: "3S",
    children: [
      {
        name: "Светильники",
        code: "3SS",
        children: [
          {
            name: "Светильники для внутреннего освещения",
            code: "3SSI",
            children: [
              { name: "Офисные светильники", code: "3SSIF" },
              { name: "Даунлайт светильники", code: "3SSID" },
              { name: "Трековые светильники", code: "3SSIT" },
              { name: "ЖКХ светильники", code: "3SSIJ" },
              { name: "Бытовые светильники", code: "3SSIB" },
              { name: "Настольные светильники", code: "3SSIN" },
              { name: "Точечные светильники", code: "3SSIR" },
            ],
                   },
                   {
            name: "Светильники для наружнего освещения",
            code: "3SSO",
            children: [
              { name: "Дорожные светильники", code: "3SSOW" },
              { name: "Парковые светильники", code: "3SSOD" },
              { name: "Садовые светильники", code: "3SSOS" },
              { name: "Прожекторы", code: "3SSOP" },
              { name: "Переносные светильники", code: "3SSOU" },
              { name: "Декоративный свет", code: "3SSOK" },
            ],
          },
        ],
      },
      { name: "Лампы", code: "3SL" },
      {
        name: "Аксессуары для светильников",
        code: "3SA",
        children: [
          { name: "Драйверы", code: "3SAD" },
          { name: "Патроны, ламподержатели", code: "3SAP" },
          { name: "Прочее", code: "3SAA" },
        ],
      },
    ],
  },
  {
    name: "Электроустановочные изделия",
    code: "4U",
    children: [
      {
        name: "Скрытого монтажа",
        code: "4US",
        children: [
          { name: "Розетки", code: "4USR" },
          { name: "Выключатели и переключатели", code: "4USV" },
          { name: "Светорегуляторы (диммеры)", code: "4USS" },
          { name: "Терморегуляторы", code: "4UST" },
          { name: "Кнопки", code: "4USK" },
        ],
      },
      {
        name: "Открытого монтажа",
        code: "4UO",
        children: [
          { name: "Розетки", code: "4UOR" },
          { name: "Выключатели и переключатели", code: "4UOV" },
          { name: "Светорегуляторы (диммеры)", code: "4UOS" },
          { name: "Терморегуляторы", code: "4UOT" },
          { name: "Кнопки", code: "4UOK" },
        ],
      },
      { name: "Аксессуары для электроустановочных изделий", code: "4UA" },
      {
        name: "Коробки установочные",
        code: "4UK",
        children: [
          { name: "Для установки в бетон", code: "4UKB" },
          { name: "Для установки в полые стены", code: "4UKG" },
          { name: "Переходные коробки для наружнего монтажа", code: "4UKP" },
        ],
      },
      {
        name: "Передвижные установки",
        code: "4UP",
        children: [
          { name: "Удлинители", code: "4UPU" },
          { name: "Сетевые фильтры", code: "4UPF" },
          { name: "Переходники", code: "4UPP" },
          { name: "Вилки", code: "4UPV" },
        ],
      },
    ],
  },
  {
    name: "Низковольтное оборудование",
    code: "5A",
    children: [
      {
        name: "Аппараты защиты",
        code: "5AZ",
        children: [
          { name: "Автоматические выключатели", code: "5AZA" },
          { name: "Дифференциальная защита (УЗО, ДифБлоки)", code: "5AZU" },
          { name: "Вспомогательные элементы", code: "5AZV" },
        ],
      },
      { name: "Пускатели, контакторы", code: "5AP" },
      { name: "Рубильники", code: "5AR" },
      {
        name: "Счетчики электроэнергии",
        code: "5AS",
        children: [
          { name: "Однофазные", code: "5AS1" },
          { name: "Трехфазные", code: "5AS3" },
        ],
      },
      { name: "Кнопки", code: "5AK" },
      { name: "Трансформаторы", code: "5AT" },
      { name: "Измерительные приборы", code: "5AI" },
    ],
  },
  {
    name: "Щитовое оборудование",
    code: "6H",
    children: [
      {
        name: "Щиты электрические",
        code: "6HE",
        children: [
          {
            name: "Щитовые корпусы",
            code: "6HEK",
            children: [
              { name: "Щитовые корпусы пластиковые", code: "6HEKP" },
              { name: "Щитовые корпусы металлические", code: "6HEKM" },
            ],
          },
          { name: "Щиты в сборе", code: "6HES" },
        ],
      },
      { name: "Аксессуары для щитового оборудования", code: "6HA" },
      { name: "Шины", code: "6HH" },
      { name: "Клеммы", code: "6HK" },
    ],
  },
  {
    name: "Инструмент",
    code: "7I",
    children: [
      { name: "Ручной инструмент", code: "7IR" },
      { name: "Сварочное оборудование", code: "7IS" },
      { name: "Паяльное оборудование", code: "7IP" },
      { name: "Строительное оборудование", code: "7IB" },
    ],
  },
];

// ==== МОДАЛЬНОЕ ОКНО ОФОРМЛЕНИЯ ЗАКАЗА ====
function OrderModal({ onClose, onSubmit, loading }) {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [isLegalEntity, setIsLegalEntity] = React.useState(false);
  const [orgInn, setOrgInn] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      setError('Пожалуйста, заполните все обязательные поля.');
      return;
    }
    if (isLegalEntity && !orgInn) {
      setError('Пожалуйста, укажите организацию/ИНН.');
      return;
    }
    setError('');
    onSubmit({ name, phone, address, comment, isLegalEntity, orgInn });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
      <form
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <button onClick={onClose} type="button" className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-blue-700">Оформление заказа</h2>
        <div className="mb-4 text-gray-700 text-sm bg-blue-50 rounded p-3">
          После оформления заявки вам перезвонит менеджер. Если вы юридическое лицо/ИП, можно обсудить специальные условия.
        </div>
        <input
          type="text"
          placeholder="ФИО"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
          required
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
          required
        />
        <input
          type="text"
          placeholder="Адрес доставки"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
          required
        />
        <textarea
          placeholder="Комментарий к заказу (необязательно)"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
        />
        <label className="flex items-center mb-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isLegalEntity}
            onChange={e => setIsLegalEntity(e.target.checked)}
            className="mr-2"
          />
          <span>Я юридическое лицо/ИП</span>
        </label>
        {isLegalEntity && (
          <input
            type="text"
            placeholder="Организация/ИНН"
            value={orgInn}
            onChange={e => setOrgInn(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 mb-3"
            required
          />
        )}
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold mt-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Отправка...' : 'Оформить заказ'}
        </button>
      </form>
    </div>
  );
}

// ==== СТРАНИЦА МОИХ ЗАКАЗОВ ====
function OrdersPage({ orders, user }) {
  const userOrders = orders.filter(o => o.username === user?.username);
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Мои заказы</h1>
      {userOrders.length === 0 ? (
        <p className="text-gray-600">У вас пока нет заказов.</p>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <div className="mb-2 text-gray-700 text-sm">Заказ от {order.date}</div>
              <div className="mb-2"><b>Имя:</b> {order.name}</div>
              <div className="mb-2"><b>Адрес:</b> {order.address}</div>
              <div className="mb-2"><b>Состав заказа:</b></div>
              <ul className="list-disc list-inside text-gray-700 mb-2">
                {order.items.map((item, i) => (
                  <li key={i}>{item.name} — {item.quantity} шт. × {item.price} ₽</li>
                ))}
              </ul>
              <div className="font-bold text-blue-700">Сумма: {order.total} ₽</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
