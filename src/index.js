// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap CSS globalmente
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client'; // Importamos desde 'react-dom/client' en lugar de 'react-dom'
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Componente principal que maneja redirección en recarga
function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.location.pathname || window.location.pathname !== '/') {
      navigate('/'); // Redirige al login si se recarga en otra ruta
    }
  }, [navigate]);

  return <App />;
}

// Obtén el contenedor raíz del DOM
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Crea el root con createRoot

// Renderiza la aplicación usando el nuevo método
root.render(
  <React.StrictMode>
    <Router>
      <Main />
    </Router>
  </React.StrictMode>
);

reportWebVitals();
