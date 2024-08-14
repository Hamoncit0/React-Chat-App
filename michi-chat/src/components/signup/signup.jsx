import React from 'react'
import './signup.css'
import yarnImg from '../../assets/yarn.png'

function signup() {
  return (
    <div className='signup'>
        <div className="title">
            <h1>Regístrate</h1>
            <img src={yarnImg} alt="" />
        </div>
        <form action="" className='signup_form'>
            <div className='formfield'>
            <input type="text" placeholder='Nombre(s)' />
            </div>
            <div className='formfield'>
            <input type="text" placeholder='Apellido(s)' />
            </div>
            <div className='formfield'>
            <input type="text" placeholder='Usuario' />
            </div>
            <div className='formfield'>
            <input type="text" placeholder='Correo electrónico' />
            </div>
            <div className='formfield'>
            <input type="text" placeholder='Contraseña' />
            </div>
            <button className='signup_button'>Iniciar Sesión</button>
        </form>
        
    </div>
  )
}

export default signup
