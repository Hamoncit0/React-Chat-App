import React, { useState } from 'react';
import './login.css';
import bigLogo from '../../assets/logo_big.png';
import Signup from '../signup/signup';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

function Login() {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const isValidEmail = (email) => {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    // Validaciones de email y password
    if (!email || !password) {
      toast.error('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Ingresa un correo válido.');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Se pudo ingresar exitosamente!');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo ingresar :(');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className={`login ${modal ? 'blur-background' : ''}`}>
        <div className="login_left">
          <img src={bigLogo} alt="michi chat logo" className="michiChatLogo" />
          <div className="gradient"></div>
        </div>
        <div className="login_right">
          <h2 className="title">¡Bienvenido!</h2>
          <form onSubmit={handleLogin} className="login_form">
            <div className="formfield">
              <input 
                type="text" 
                placeholder="Correo electrónico" 
                name="email" 
                required 
              />
            </div>
            <div className="formfield">
              <input 
                type="password" 
                placeholder="Contraseña" 
                name="password" 
                required 
              />
            </div>
            <button className="login_button" disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
            <div>
              <p className="text">
                ¿Todavía no tienes una cuenta?{' '}
                <a onClick={toggleModal}>Regístrate</a>
              </p>
            </div>
          </form>
        </div>
      </div>
      {modal && (
        <div className="modal">
          <div className="overlay">
            <Signup closeModal={toggleModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;


