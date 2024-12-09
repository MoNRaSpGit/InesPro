import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [nombre, setNombre] = useState('Ines');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para redirección

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://inespro-back-1.onrender.com/api/stock/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user.rol); // Actualiza el rol del usuario en App.js
        navigate('/bienvenida'); // Redirige al componente Bienvenida
      } else {
        setError(data.error || 'Error desconocido');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar sesión</button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
    </div>
  );
}
