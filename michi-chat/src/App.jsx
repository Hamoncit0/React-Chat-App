import './App.css'
import Login from './components/login/login'
import Tiendita from './components/tiendita/tiendita'
import MainPage from './components/main-page/main-page'
import Header from './components/header/header'
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom'
import Notification from './components/notification/notification'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
function App() {

  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log(user);
    });
    return() =>{
      unSub();
    }

  }, [])
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/main" element={
            <>
              <MainPage/>
            </>} />
            <Route path="/tiendita" element={
            <>
              <Header/>
              <Tiendita/>
            </>} />
          <Route path="/" element={
            <>
              <Login />
            </>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Notification/>
    </div>
  )
}

export default App
