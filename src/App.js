import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Bienvenida from './componentes/Bienvenida';
import UpExcel from './componentes/UpExcel';
import Compras from './componentes/Compras';
import Ximena from './componentes/Ximena';
import Camion from './componentes/Camion';
import Stock from './componentes/Stock';
import Login from './componentes/Login'; // Nuevo componente Login

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // admin o user

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Provider store={store}>
      <Router>
        {isAuthenticated && (
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  {userRole === 'admin' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/bienvenida">Inicio</Link>
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
                        <Link className="nav-link" to="/stock">Stock</Link>
                      </li>
                    </>
                  )}
                  {userRole === 'user' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/ximena">Ximena</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>Cerrar sesión</button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        )}

        <div className="container mt-5">
          <Routes>
            {!isAuthenticated ? (
              <Route path="*" element={<Login onLogin={handleLogin} />} />
            ) : (
              <>
                {userRole === 'admin' && (
                  <>
                    <Route path="/bienvenida" element={<Bienvenida />} />
                    <Route path="/up-excel" element={<UpExcel />} />
                    <Route path="/compras" element={<Compras />} />
                    <Route path="/ximena" element={<Ximena />} />
                    <Route path="/camion" element={<Camion />} />
                    <Route path="/stock" element={<Stock />} />
                  </>
                )}
                {userRole === 'user' && (
                  <Route path="/ximena" element={<Ximena />} />
                )}
                <Route path="*" element={<Navigate to={userRole === 'admin' ? '/bienvenida' : '/ximena'} />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;