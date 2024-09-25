import React from 'react'
import { useState } from 'react'
import './login.css'
import bigLogo from '../../assets/logo_big.png'
import Signup from '../signup/signup';
import { toast } from 'react-toastify';

function login() {
  const [modal, setModal] = useState(false);
  const toggleModal = ()=>{
    setModal(!modal)
  }
  const handleLogin = (e) =>{
    e.preventDefault();
    toast.success("Hello")
  }
  return (
    <div className="container">
      
    <div className={`login ${modal ? 'blur-background' : ''}`}>
      <div className="login_left">
        <img src={bigLogo} alt="michi chat logo" className='michiChatLogo'/>
        <div className="gradient"></div>
      </div>
      <div className="login_right">
      <h2 className='title'>¡Bienvenido!</h2>
      <form onSubmit={handleLogin} className='login_form'>
        <div className='formfield'>
          <input type="text" placeholder='Correo electrónico' />
        </div>
        <div className='formfield'>
          <input type="text" placeholder='Contraseña' />
        </div>
        <button className='login_button'>Iniciar Sesión</button>
        <div>
            <p className='text'>¿Todavía no tienes una cuenta? <a onClick={toggleModal}>Regístrate</a></p>
        </div>
      </form>
      </div>
    </div>
      {modal && (
        <div className="modal">
              <div className="overlay">
                <Signup closeModal={toggleModal}></Signup>
              </div>
        </div>
      )}
    </div>
  )
}

export default login
