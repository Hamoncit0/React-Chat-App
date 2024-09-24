import React from 'react'
import './signup.css'
import yarnImg from '../../assets/yarn.png'
import CloseIcon from '@mui/icons-material/Close';
function signup({isOpen, closeModal, children}) {
  return (
    <div className='signup'>
      <div className='close'>
        <button className='close_button' onClick={closeModal}><CloseIcon fontSize='medium'></CloseIcon></button>
      </div>
        <div className="title">
            <h1>Regístrate</h1>
            <img src={yarnImg} alt="" />
        </div>
        <form action="" className='signup_form'>
            <div className='formfield'>
            <input type="text" placeholder='Nombre(s)' required/>
            </div>
            <div className='formfield'>
            <input type="text" placeholder='Apellido(s)' required/>
            </div>
            <div className='formfield'>
            <input type="text" placeholder='Usuario' required/>
            </div>
            <div className='formfield'>
            <input type="email" placeholder='Correo electrónico' required/>
            </div>
            <div className='formfield'>
            <input type="password" placeholder='Contraseña' required/>
            </div>
            <button type='submit' className='signup_button'>¡Listo!</button>
        </form>
    </div>
  )
}

export default signup
