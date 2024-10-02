import React, { useState, useEffect } from 'react';
import './header.css'
import logo from '../../assets/logo_medium.png'
import pictuere from '../../assets/pictures/magicbara.png'
import { Link } from 'react-router-dom';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Switch from '@mui/material/Switch';
import { useUserStore } from '../../lib/userStore'
import { auth } from '../../lib/firebase';
function header() {
  ////////////////////////MODO OSCURO//////////////////////
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

  // Controlar el cambio del Switch de tema oscuro
  const handleThemeSwitchChange = (event) => {
    toggleTheme();  // Cambiar el tema cuando se use el Switch
  };

  ////////////////////////////////DROPDOWN MENU//////////////////////////
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
/////////////////INFO USU/////////////////////////////
const { currentUser } = useUserStore();


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
          </ul>
        </div>
        <div className='profile_picture'
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}>
          <img  src={currentUser.avatar || 'src\assets\pictures\avatar-blank.png'} alt="" />
          <div className="status_circle">
          </div>
        </div>

        <Menu
        className='dropdown-menu'
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Cambiar a {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        <Switch
            color="var(--color-primary)"
            checked={isDarkMode} // Vincula el estado del switch con el tema oscuro
            onChange={handleThemeSwitchChange} // Maneja el cambio del switch
          /></MenuItem>
        <MenuItem onClick={()=>auth.signOut()}>Logout</MenuItem>
      </Menu>
  



    </div>
    
  )
}

export default header
