import React, { useState, useEffect } from 'react';

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
function CartPage({ cart, updateQuantity, total, removeFromCart }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Корзина</h1>
      {cart.length === 0 ? (
        <p className="text-gray-600 text-center">Ваша корзина пуста.</p>
      ) : (
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
      )}
    </div>
  );
}

function AdminPage({ catalogData, setCatalogData }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    specs: [],
  });
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categoryInput, setCategoryInput] = useState(formData.category || '');

  const allCategories = [...new Set(catalogData.map((p) => p.category))];

  useEffect(() => {
    setCategoryInput(formData.category || '');
  }, [formData.category]);

  const filteredCategories = allCategories.filter(cat =>
    cat.toLowerCase().includes(categoryInput.toLowerCase())
  );

  // --- FIX: define handleInputChange ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "category") setCategoryInput(value);
  };
  // --- end fix ---

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

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price || !formData.description) {
      alert('Заполните все поля!');
      return;
    }

    if (editingProduct) {
      // Edit existing product
      setCatalogData((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id ? { ...editingProduct, ...formData } : product
        )
      );
    } else {
      // Add new product
      const newProduct = {
        id: Math.max(...catalogData.map((p) => p.id), 0) + 1,
        ...formData,
        price: parseFloat(formData.price),
        image: 'https://placehold.co/300x300',
      };
      setCatalogData((prev) => [...prev, newProduct]);
    }

    // Reset form
    setFormData({ name: '', category: '', price: '', description: '', specs: [] });
    setEditingProduct(null);
  };

  // Handle editing a product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  // Handle deleting a product
  const handleDelete = (id) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      setCatalogData((prev) => prev.filter((product) => product.id !== id));
    }
  };

  // Добавить функцию отмены редактирования
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: '', description: '', specs: [] });
    setCategoryInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Управление каталогом</h1>
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
  const PAGE_SIZE = 16; // Updated pagination size

  const initialCatalog = [
    // Кабель и провод
    { id: 1, name: "Кабель ВВГнг-LS 3х2.5", category: "Кабель и провод > Кабель силовой", price: 35, description: "Пожаробезопасный силовой кабель.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "3х2.5 мм²" }] },
    { id: 2, name: "Кабель NYM 3х1.5", category: "Кабель и провод > Кабель силовой", price: 28, description: "Кабель для стационарной прокладки.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "3х1.5 мм²" }] },
    { id: 3, name: "Кабель ВВГ-П 2х1.5", category: "Кабель и провод > Кабель силовой", price: 22, description: "Гибкий силовой кабель.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "2х1.5 мм²" }] },

    { id: 4, name: "Кабель КВВГ 5х2.5", category: "Кабель и провод > Кабель монтажный", price: 40, description: "Монтажный кабель для сигнализации.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "5х2.5 мм²" }] },
    { id: 5, name: "Кабель ПВС 2х1.5", category: "Кабель и провод > Кабель монтажный", price: 18, description: "Гибкий монтажный кабель.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "2х1.5 мм²" }] },
    { id: 6, name: "Кабель КВВГ 7х1.0", category: "Кабель и провод > Кабель монтажный", price: 25, description: "Монтажный кабель для управления.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "7х1.0 мм²" }] },

    { id: 7, name: "Провод ПВС 3х1.5", category: "Кабель и провод > Провода и шнуры", price: 15, description: "Гибкий провод для бытовых приборов.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "3х1.5 мм²" }] },
    { id: 8, name: "Провод ШВВП 2х0.75", category: "Кабель и провод > Провода и шнуры", price: 10, description: "Плоский шнур для осветительных приборов.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "2х0.75 мм²" }] },
    { id: 9, name: "Провод МГТФ 1х0.5", category: "Кабель и провод > Провода и шнуры", price: 8, description: "Термостойкий монтажный провод.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "1х0.5 мм²" }] },

    { id: 10, name: "Провод СИП-4 2х16", category: "Кабель и провод > Провода для ЛЭП", price: 55, description: "Провод для воздушных линий электропередач.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "2х16 мм²" }] },
    { id: 11, name: "Провод АС 35", category: "Кабель и провод > Провода для ЛЭП", price: 60, description: "Алюминиевый провод для ЛЭП.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "35 мм²" }] },
    { id: 12, name: "Провод СИП-2А 3х25", category: "Кабель и провод > Провода для ЛЭП", price: 80, description: "Самонесущий изолированный провод.", image: "https://placehold.co/300x300", specs: [{ key: "Сечение", value: "3х25 мм²" }] },

    // Прокладка кабеля > Лотки и шинопровод > Лотки перфорированные
    { id: 13, name: "Лоток перфорированный 100х50", category: "Прокладка кабеля > Лотки и шинопровод > Лотки перфорированные", price: 120, description: "Металлический лоток для кабеля.", image: "https://placehold.co/300x300", specs: [{ key: "Размер", value: "100х50" }] },
    { id: 14, name: "Лоток перфорированный 200х50", category: "Прокладка кабеля > Лотки и шинопровод > Лотки перфорированные", price: 180, description: "Широкий лоток для кабеля.", image: "https://placehold.co/300x300", specs: [{ key: "Размер", value: "200х50" }] },
    { id: 15, name: "Лоток перфорированный 300х50", category: "Прокладка кабеля > Лотки и шинопровод > Лотки перфорированные", price: 250, description: "Большой лоток для кабеля.", image: "https://placehold.co/300x300", specs: [{ key: "Размер", value: "300х50" }] },

    // Прокладка кабеля > Лотки и шинопровод > Лотки неперфорированные
    { id: 16, name: "Лоток неперфорированный 100х50", category: "Прокладка кабеля > Лотки и шинопровод > Лотки неперфорированные", price: 110, description: "Глухой лоток для кабеля.", image: "https://placehold.co/300x300", specs: [{ key: "Размер", value: "100х50" }] },
    { id: 17, name: "Лоток неперфорированный 200х50", category: "Прокладка кабеля > Лотки и шинопровод > Лотки неперфорированные", price: 170, description: "Глухой лоток для кабеля.", image: "https://placehold.co/300x300", specs: [{ key: "Размер", value: "200х50" }] },
    { id: 18, name: "Лоток неперфорированный 300х50", category: "Прокладка кабеля > Лотки и шинопровод > Лотки неперфорированные", price: 230, description: "Глухой лоток для кабеля.", image: "https://placehold.co/300x300", specs: [{ key: "Размер", value: "300х50" }] },

    // Прокладка кабеля > Лотки и шинопровод > Лотки лестничные
    { id: 19, name: "Лоток лестничный 100х50", category: "Прокладка кабеля > Лотки и шинопровод > Лотки лестничные", price: 130, description: "Лестничный лоток для кабеля.", image: "https://placehold.co/300x300", specs: [{ key: "Размер", value: "100х50" }] },
    { id: 20, name: "Лоток лестничный 200х50", category: "Прокладка кабеля > Лотки и шинопровод > Лотки лестничные", price: 190, description: "Лестничный лоток для кабеля.", image: "https://placehold.co/300x300", specs: [{ key: "Размер", value: "200х50" }] },
    { id: 21, name: "Лоток лестничный 300х50", category: "Прокладка кабеля > Лотки и шинопровод > Лотки лестничные", price: 260, description: "Лестничный лоток для кабеля.", image: "https://placehold.co/300x300", specs: [{ key: "Размер", value: "300х50" }] },

    // Прокладка кабеля > Лотки и шинопровод > Шинопровод
    { id: 22, name: "Шинопровод 100А", category: "Прокладка кабеля > Лотки и шинопровод > Шинопровод", price: 500, description: "Шинопровод на 100А.", image: "https://placehold.co/300x300", specs: [{ key: "Ток", value: "100А" }] },
    { id: 23, name: "Шинопровод 250А", category: "Прокладка кабеля > Лотки и шинопровод > Шинопровод", price: 900, description: "Шинопровод на 250А.", image: "https://placehold.co/300x300", specs: [{ key: "Ток", value: "250А" }] },
    { id: 24, name: "Шинопровод 400А", category: "Прокладка кабеля > Лотки и шинопровод > Шинопровод", price: 1500, description: "Шинопровод на 400А.", image: "https://placehold.co/300x300", specs: [{ key: "Ток", value: "400А" }] },

    // Светотехника > Светильники > Светильники для внутреннего освещения > Офисные светильники
    { id: 25, name: "Офисный светильник LED 36Вт", category: "Светотехника > Светильники > Светильники для внутреннего освещения > Офисные светильники", price: 900, description: "Потолочный офисный светильник.", image: "https://placehold.co/300x300", specs: [{ key: "Мощность", value: "36Вт" }] },
    { id: 26, name: "Офисный светильник LED 48Вт", category: "Светотехника > Светильники > Светильники для внутреннего освещения > Офисные светильники", price: 1200, description: "Яркий офисный светильник.", image: "https://placehold.co/300x300", specs: [{ key: "Мощность", value: "48Вт" }] },
    { id: 27, name: "Офисный светильник LED 24Вт", category: "Светотехника > Светильники > Светильники для внутреннего освещения > Офисные светильники", price: 700, description: "Компактный офисный светильник.", image: "https://placehold.co/300x300", specs: [{ key: "Мощность", value: "24Вт" }] },

    // Светотехника > Светильники > Светильники для внутреннего освещения > Даунлайт светильники
    { id: 28, name: "Даунлайт светильник 12Вт", category: "Светотехника > Светильники > Светильники для внутреннего освещения > Даунлайт светильники", price: 350, description: "Встраиваемый даунлайт.", image: "https://placehold.co/300x300", specs: [{ key: "Мощность", value: "12Вт" }] },
    { id: 29, name: "Даунлайт светильник 18Вт", category: "Светотехника > Светильники > Светильники для внутреннего освещения > Даунлайт светильники", price: 450, description: "Круглый даунлайт.", image: "https://placehold.co/300x300", specs: [{ key: "Мощность", value: "18Вт" }] },
    { id: 30, name: "Даунлайт светильник 24Вт", category: "Светотехника > Светильники > Светильники для внутреннего освещения > Даунлайт светильники", price: 600, description: "Большой даунлайт.", image: "https://placehold.co/300x300", specs: [{ key: "Мощность", value: "24Вт" }] },

    // Светотехника > Светильники > Светильники для внутреннего освещения > Трековые светильники
    { id: 31, name: "Трековый светильник 10Вт", category: "Светотехника > Светильники > Светильники для внутреннего освещения > Трековые светильники", price: 800, description: "Трековый светильник для магазинов.", image: "https://placehold.co/300x300", specs: [{ key: "Мощность", value: "10Вт" }] },
    { id: 32, name: "Трековый светильник 20Вт", category: "Светотехника > Светильники > Светильники для внутреннего освещения > Трековые светильники", price: 1200, description: "Яркий трековый светильник.", image: "https://placehold.co/300x300", specs: [{ key: "Мощность", value: "20Вт" }] },
    { id: 33, name: "Трековый светильник 30Вт", category: "Светотехника > Светильники > Светильники для внутреннего освещения > Трековые светильники", price: 1600, description: "Мощный трековый светильник.", image: "https://placehold.co/300x300", specs: [{ key: "Мощность", value: "30Вт" }] },

    // ...добавьте по 3 товара для каждой самой глубокой подкатегории аналогично примеру выше...
  ];

  // Исправленная инициализация каталога:
  function getInitialCatalog() {
    try {
      // Не нужно оставлять строку localStorage.removeItem('catalog');
      const stored = JSON.parse(localStorage.getItem('catalog'));
      if (Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
    } catch (e) {}
    return initialCatalog;
  }

  // Получаем данные из localStorage
  const [catalogData, setCatalogData] = useState(getInitialCatalog());
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingCatalog, setEditingCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [specFilters, setSpecFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  // [Change] Add new state to hold category filter during search:
  const [searchCategoryFilter, setSearchCategoryFilter] = useState('');

  // Сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem('catalog', JSON.stringify(catalogData));
  }, [catalogData]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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

  switch (currentHash) {
    case 'main':
      return (
        <div className="bg-gray-100 min-h-screen font-sans">
          <Header totalAmount={totalAmount} />
          <SiteSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <MainPage />
          <Footer />
        </div>
      );
    case 'about':
      return (
        <div className="bg-gray-100 min-h-screen font-sans">
          <Header totalAmount={totalAmount} />
          <SiteSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <AboutPage />
          <Footer />
        </div>
      );
    case 'contact':
      return (
        <div className="bg-gray-100 min-h-screen font-sans">
          <Header totalAmount={totalAmount} />
          <SiteSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <ContactPage />
          <Footer />
        </div>
      );
    case 'cart':
      return (
        <div className="bg-gray-100 min-h-screen font-sans">
          <Header totalAmount={totalAmount} />
          <SiteSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <CartPage
            cart={cart}
            updateQuantity={updateQuantity}
            total={totalAmount}
            removeFromCart={removeFromCart}
          />
          <Footer />
        </div>
      );
    case 'kateh':
      return (
        <div className="bg-gray-100 min-h-screen font-sans">
          <Header totalAmount={totalAmount} />
          <SiteSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <AdminPage catalogData={catalogData} setCatalogData={setCatalogData} />
          <Footer />
        </div>
      );
    case 'home':
    default:
      return (
        <div className="bg-gray-100 min-h-screen font-sans">
          <Header totalAmount={totalAmount} />
          <SiteSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <HomePage
            products={applyFilters()}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            searchCategoryFilter={searchCategoryFilter}         // <-- new prop
            setSearchCategoryFilter={setSearchCategoryFilter}   // <-- new prop
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
          <Footer />
        </div>
      );
  }
}

// ==== Шапка сайта ====
function Header({ totalAmount }) {
  const goTo = (page) => {
    window.location.hash = page;
  };

  // При нажатии на "Каталог" сбрасываем выбор категорий
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
        <nav className="flex space-x-2 md:space-x-6">
          <button
            onClick={() => {
              goTo('home');
              // Сброс выбора категорий при переходе в каталог
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
        </nav>
      </div>
    </header>
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

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-200 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full border border-gray-200 cursor-pointer"
      onClick={handleSelect}
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
        </div>
        <div className="mt-4 flex items-center justify-end space-x-2">
          {quantityInCart > 0 ? (
            <>
              <button
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-150 text-lg font-semibold"
              >-</button>
              <span className="w-8 text-center font-semibold text-gray-800">{quantityInCart}</span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-150 text-lg font-semibold"
              >+</button>
            </>
          ) : (
            <button
              onClick={handleAdd}
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
function ProductSpecifications({ specs }) {
  const [showAll, setShowAll] = useState(false);
  const visibleSpecs = showAll ? specs : specs.slice(0, 3);

  return (
    <div className="max-h-32 overflow-y-auto">
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {visibleSpecs.map((spec, index) => (
          <li key={index}>
            <strong>{spec.key}:</strong> {spec.value}
          </li>
        ))}
      </ul>
      {specs.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-blue-600 hover:underline text-sm"
        >
          {showAll ? "Скрыть все" : "Показать все"}
        </button>
      )}
    </div>
  );
}

function ProductDescription({ description }) {
  const [showAll, setShowAll] = useState(false);
  const visibleDescription = showAll ? description : description.slice(0, 200);

  return (
    <div className="max-h-32 overflow-y-auto">
      <p className="text-gray-700">{visibleDescription}{!showAll && description.length > 200 && "..."}</p>
      {description.length > 200 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-blue-600 hover:underline text-sm"
        >
          {showAll ? "Скрыть все" : "Показать все"}
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
            {product.specs && product.specs.length > 0 && (
              <div>
                <p className="font-semibold text-gray-800 mb-2">Характеристики:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {(showFullSpecs ? product.specs : product.specs.slice(0, 3)).map(
                    (spec, index) => (
                      <li key={index}>
                        <strong>{spec.key}:</strong> {spec.value}
                      </li>
                    )
                  )}
                </ul>
                {product.specs.length > 3 && (
                  <button
                    onClick={() => setShowFullSpecs(!showFullSpecs)}
                    className="mt-2 text-blue-600 hover:underline text-sm"
                  >
                    {showFullSpecs ? "Скрыть все" : "Показать все"}
                  </button>
                )}
              </div>
            )}
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
    children: [
      { name: "Кабель силовой" },
      { name: "Кабель монтажный" },
      { name: "Провода и шнуры" },
      { name: "Провода для ЛЭП" },
    ],
  },
  {
    name: "Прокладка кабеля",
    children: [
      {
        name: "Лотки и шинопровод",
        children: [
          { name: "Лотки перфорированные" },
          { name: "Лотки неперфорированные" },
          { name: "Лотки лестничные" },
          { name: "Шинопровод" },
        ],
      },
      { name: "Распределительные коробки" },
      { name: "Разьемы" },
    ],
  },
  {
    name: "Светотехника",
    children: [
      {
        name: "Светильники",
        children: [
          {
            name: "Светильники для внутреннего освещения",
            children: [
              { name: "Офисные светильники" },
              { name: "Даунлайт светильники" },
              { name: "Трековые светильники" },
              { name: "ЖКХ светильники" },
              { name: "Бытовые светильники" },
              { name: "Настольные светильники" },
              { name: "Точечные светильники" },
              { name: "Светильники накладные бытовые" },
            ],
          },
          {
            name: "Светильники для наружнего освещения",
            children: [
              { name: "Дорожные светильники" },
              { name: "Парковые светильники" },
              { name: "Садовые светильники" },
              { name: "Прожекторы" },
              { name: "Переносные светильники" },
              { name: "Декоративный свет" },
            ],
          },
        ],
      },
      { name: "Лампы" },
      {
        name: "Аксессуары для светильников",
        children: [
          { name: "Драйверы" },
          { name: "Патроны, ламподержатели" },
          { name: "Прочее" },
        ],
      },
    ],
  },
  {
    name: "Электроустановочные изделия",
    children: [
      {
        name: "Скрытого монтажа",
        children: [
          { name: "Розетки" },
          { name: "Выключатели и переключатели" },
          { name: "Светорегуляторы (диммеры)" },
          { name: "Терморегуляторы" },
          { name: "Кнопки" },
        ],
      },
      {
        name: "Открытого монтажа",
        children: [
          { name: "Розетки" },
          { name: "Выключатели и переключатели" },
          { name: "Светорегуляторы (диммеры)" },
          { name: "Терморегуляторы" },
          { name: "Кнопки" },
        ],
      },
      { name: "Аксессуары для электроустановочных изделий" },
      {
        name: "Коробки установочные",
        children: [
          { name: "Для установки в бетон" },
          { name: "Для установки в полые стены" },
          { name: "Переходные коробки для наружнего монтажа" },
        ],
      },
      {
        name: "Передвижные установки",
        children: [
          { name: "Удлинители" },
          { name: "Сетевые фильтры" },
          { name: "Переходники" },
          { name: "Вилки" },
        ],
      },
    ],
  },
  {
    name: "Низковольтное оборудование",
    children: [
      {
        name: "Аппараты защиты",
        children: [
          { name: "Автоматические выключатели" },
          { name: "Дифференциальная защита (УЗО, ДифБлоки)" },
          { name: "Вспомогательные элементы" },
        ],
      },
      { name: "Пускатели, контакторы" },
      { name: "Рубильники" },
      {
        name: "Счетчики электроэнергии",
        children: [
          { name: "Однофазные" },
          { name: "Трехфазные" },
        ],
      },
      { name: "Кнопки" },
      { name: "Трансформаторы" },
      { name: "Измерительные приборы" },
    ],
  },
  {
    name: "Щитовое оборудование",
    children: [
      {
        name: "Щиты электрические",
        children: [
          { name: "Щитовые корпусы пластиковые" },
          { name: "Щитовые корпусы металлические" },
        ],
      },
      { name: "Щиты в сборе" },
      { name: "Аксессуары для щитового оборудования" },
      { name: "Шины" },
      { name: "Клеммы" },
    ],
  },
  {
    name: "Инструмент",
    children: [
      { name: "Ручной инструмент" },
      { name: "Сварочное оборудование" },
      { name: "Паяльное оборудование" },
      { name: "Строительное оборудование" },
    ],
  },
];
