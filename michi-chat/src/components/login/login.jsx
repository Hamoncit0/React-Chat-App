import React from 'react'
import './login.css'
import bigLogo from '../../assets/logo_big.png'
function login() {
  return (
    <div className='login'>
      <div className="login_left">
        <img src={bigLogo} alt="michi chat logo" className='michiChatLogo'/>
        <div className="gradient"></div>
      </div>
      <div className="login_right">
      <h2 className='title'>¡Bienvenido!</h2>
      <form action="" className='login_form'>
        <div className='formfield'>
          <input type="text" placeholder='Correo electrónico' />
        </div>
        <div className='formfield'>
          <input type="text" placeholder='Contraseña' />
        </div>
        <button className='login_button'>Iniciar Sesión</button>
        <div>
            <p className='text'>¿Todavía no tienes una cuenta? <a href="">Regístrate</a></p>
        </div>
      </form>
      </div>
    </div>
  )
}

export default login
