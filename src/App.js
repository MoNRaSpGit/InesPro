import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Bienvenida from './componentes/Bienvenida';
import UpExcel from './componentes/UpExcel';
import Compras from './componentes/Compras';
import Ximena from './componentes/Ximena';
import Camion from './componentes/Camion';
import Stock from './componentes/Stock'; // Importar el componente Stock

function App() {
  return (
    <Provider store={store}>
      <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">InesPro</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Inicio</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/up-excel">Subir Excel</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/compras">Compras</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ximena">Ximena</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/camion">Camion</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stock">Stock</Link> {/* Enlace al componente Stock */}
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Bienvenida />} />
            <Route path="/up-excel" element={<UpExcel />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/ximena" element={<Ximena />} />
            <Route path="/camion" element={<Camion />} />
            <Route path="/stock" element={<Stock />} /> {/* Ruta para el componente Stock */}
            {/* Redirecciona al home si no encuentra la ruta */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
