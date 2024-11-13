import React, { useState, useEffect } from 'react';
import './header.css'
import logo from '../../assets/logo_medium.png'
import { Link, useNavigate } from 'react-router-dom';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import { useUserStore } from '../../lib/userStore'
import { auth } from '../../lib/firebase';
import { db } from '../../lib/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

import patito from '../../assets/sombreritos/patito.png';
import santahat from '../../assets/sombreritos/santahat.png';
import cuernos from '../../assets/sombreritos/cuernos.png';
import michiorejas from '../../assets/sombreritos/michiorejas.png';
import chefhat from '../../assets/sombreritos/chefhat.png';

function Header() {
  const navigate = useNavigate(); // Inicializa useNavigate para redirigir
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { currentUser } = useUserStore();
  const [status, setStatus] = useState(false)
  const [activeHatImage, setActiveHatImage] = useState(null);

  const hats = [
    { id: 'patito', name: 'Patito', price: 10, image: patito },
    { id: 'santahat', name: 'Santa', price: 10, image: santahat },
    { id: 'cuernos', name: 'Bisonte', price: 10, image: cuernos },
    { id: 'michiorejas', name: 'Egirl', price: 10, image: michiorejas },
    { id: 'chefhat', name: 'Let him cook', price: 10, image: chefhat }
  ];


  // Escucha los cambios en tiempo real del campo `activeCosmetic` del usuario actual
  useEffect(() => {
    if (!currentUser?.id) return;

    const userRef = doc(db, 'users', currentUser.id);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data();
        const hat = hats.find(h => h.id === userData.activeCosmetic);
        setActiveHatImage(hat ? hat.image : null);
      }
    });

    // Limpia la suscripción cuando el componente se desmonta o el usuario cambia
    return () => unsubscribe();
  }, [currentUser?.id]);

  const setUserOnlineStatus = async (userId, isOnlineStatus) => {
    if (!userId) {
      console.error("El ID de usuario no está definido");
      return;
    }
  
    const userRef = doc(db, "users", userId);
    try {
      await updateDoc(userRef, {
        isOnline: isOnlineStatus
      });
      console.log(`Estado online actualizado a ${isOnlineStatus} para el usuario con ID: ${userId}`);
    } catch (error) {
      console.error("Error al actualizar el estado online:", error);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('darktheme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('isDarkMode', newTheme);
  };

  const toggleStatus = ()=>{
    setStatus(!status)
    setUserOnlineStatus(currentUser.id, status)
    console.log('status el user: ' + status)
  }

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('darktheme');
    } else {
      document.body.classList.remove('darktheme');
    }
  }, [isDarkMode]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="header">
      <img className='header_logo' src={logo} alt="michi chat logo" />
      <div className='opciones'>
        <ul className='nav'>
          <Link className='linkD' to="/main">
            <li> Chats</li>
          </Link>
          <Link className='linkD' to="/tiendita">
            <li>Tiendita</li>
          </Link>
        </ul>
      </div>
      <div className='profile_picture'
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}>
          { currentUser?.activeCosmetic && <img src={activeHatImage} alt="Active Hat" className='activeHatCurrentUser' />}
        <img src={currentUser?.avatar || 'src/assets/pictures/avatar-blank.png'} alt="" />
        <div className={`${!status ? 'status-circle-online' : 'status-circle-offline'}`}></div>
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
        <MenuItem>
          Cambiar a {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          <Switch
            color="var(--color-primary)"
            checked={isDarkMode}
            onChange={toggleTheme}
          />
        </MenuItem>
        <MenuItem>
          Cambiar a {status ? 'Conectado' : 'Desconectado'}
          <Switch
            color="green"
            checked={!status}
            onChange={toggleStatus}
          />
        </MenuItem>
        <MenuItem onClick={async () => {
          try {
            await auth.signOut();  // Cerrar sesión de Firebase
            if (currentUser?.id) {
              await setUserOnlineStatus(currentUser.id, false);  // Marcar al usuario como offline
            }
            navigate('/login');  // Redirigir al login
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
          }
        }}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default Header;