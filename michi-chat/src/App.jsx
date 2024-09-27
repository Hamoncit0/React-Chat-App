import './App.css';
import Login from './components/login/login'
import Tiendita from './components/tiendita/tiendita'
import MainPage from './components/main-page/main-page'
import Header from './components/header/header'
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom'
import Notification from './components/notification/notification'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useUserStore } from './lib/userStore'
function App() {
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

  const {currentUser, isLoading, fetchUserInfo} = useUserStore()
  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return() =>{
      unSub();
    }

  }, [fetchUserInfo])


  if(isLoading) return <div className='loading'>Loading...</div>
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/main" /> : <Login />} />
        <Route path="/main" element={currentUser ? <MainPage /> : <Navigate to="/" />} />
        <Route path="/tiendita" element={currentUser ? 
          <>
            <Header />
            <Tiendita />
          </> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    <Notification />
  </div>
  )
}

export default App
