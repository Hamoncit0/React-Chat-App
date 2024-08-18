import React, { useState, useEffect } from 'react';
import './header.css'
import logo from '../../assets/logo_medium.png'
import pictuere from '../../assets/pictures/magicbara.png'


function header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

    // Cambia el tema al hacer clic en el botón
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    }; 
    // Efecto para agregar o remover la clase 'dark-mode' al body
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('darktheme');
        } else {
            document.body.classList.remove('darktheme');
        }
    }, [isDarkMode]);  // Se ejecuta cada vez que isDarkMode cambia

  return (
    <div className="header">
        <img className='header_logo' src={logo} alt="michi chat logo" />
        <div className='opciones'>
          <ul className='nav'>
            <li>Chats</li>
            <li>Tiendita</li>
            <li>
            <h5>Modo {isDarkMode ? 'Oscuro' : 'Claro'}</h5>
                <button onClick={toggleTheme}>
                    Cambiar a {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </li>
          </ul>
        </div>
        <div className='profile_picture'>
          <img  src={pictuere} alt="" />
          <div className="status_circle">
          </div>
        </div>
    </div>
  )
}

export default header
