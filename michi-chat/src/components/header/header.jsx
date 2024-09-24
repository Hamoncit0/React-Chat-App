import React, { useState, useEffect } from 'react';
import './header.css'
import logo from '../../assets/logo_medium.png'
import pictuere from '../../assets/pictures/magicbara.png'
import { Link } from 'react-router-dom';
import { Avatar, Badge, Box } from '@mui/material';

function header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('darktheme');
    }
  }, []);

  // Cambia el tema y guarda la preferencia en localStorage
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('isDarkMode', newTheme);
  };

  // Efecto para agregar o remover la clase 'dark-mode' al body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('darktheme');
    } else {
      document.body.classList.remove('darktheme');
    }
  }, [isDarkMode]);

  return (
    <div className="header">
        <img className='header_logo' src={logo} alt="michi chat logo" />
        <div className='opciones'>
          <ul className='nav'>
            
            <Link className='linkD' to="/main">
              <li> Chats</li>
            </Link>
            <Link className='linkD' to="/tiendita">
              <li >Tiendita</li>
            </Link>
            <li>
                <button onClick={toggleTheme} style={{color:'var(--text-color)', background:'none',border: '0px', height:'100%', width:'100%', font:'inherit'}}>
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
