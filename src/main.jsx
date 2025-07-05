import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Очищаем каталог и пользователей из localStorage при запуске приложения
localStorage.removeItem('catalog');
localStorage.removeItem('users');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
