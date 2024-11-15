import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import Button from '@mui/material/Button';
import HistoryIcon from '@mui/icons-material/History';

function InicioYLogin({ onLogin }) {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // "success" or "error"

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      onLogin(storedUser);
    }
  }, [onLogin]);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Datos de inicio de sesión:', usuario, password); // Verifica los datos antes de enviarlos
      const response = await axios.post('http://localhost:3001/api/login', {
        usuario,
        password,
      });
      setMessage(response.data.message);
      setMessageType('success');
      localStorage.setItem('usuario', response.data.user.username);
      onLogin(response.data.user.username);
    } catch (error) {
      setMessage(
        error.response ? error.response.data.error : 'Error en el inicio de sesión'
      );
      setMessageType('error');
    }
};


  return (
    <div className={`container ${isLoginVisible ? 'login-active' : ''}`}>
      <div className="welcome-section">
        <h1>Bienvenidos</h1>
        <p>Ingresa a tu cuenta para acceder a más contenido.</p>

        <Button
          variant="outlined"
          sx={{
            textTransform: 'none',
            color: '#006400',
            borderColor: '#006400',
            '&:hover': {
              backgroundColor: '#00640010',
              borderColor: '#006400',
            },
            mt: 2,
          }}
          startIcon={<HistoryIcon />}
          onClick={handleLoginClick}
        >
          Acceder
        </Button>
      </div>

      <div className="image-section"></div>

      <div className={`login-section ${isLoginVisible ? 'show-login' : ''}`}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder=""
              required
            />
            <label htmlFor="usuario">Introduce tu Usuario</label>
          </div>
          <div className="input-container">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required
            />
            <label htmlFor="password">Introduce tu Contraseña</label>
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
        {message && (
          <p className={messageType === 'success' ? 'message-success' : 'message-error'}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default InicioYLogin;
