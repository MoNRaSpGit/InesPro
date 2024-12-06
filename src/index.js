// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap CSS globalmente
import React from 'react';
import ReactDOM from 'react-dom/client'; // Importamos desde 'react-dom/client' en lugar de 'react-dom'
import App from './App';
import reportWebVitals from './reportWebVitals';

// Obtén el contenedor raíz del DOM
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Crea el root con createRoot

// Renderiza la aplicación usando el nuevo método
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
