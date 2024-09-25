import React from 'react'
import './signup.css'
import yarnImg from '../../assets/yarn.png'
import CloseIcon from '@mui/icons-material/Close';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

function signup({isOpen, closeModal, children}) {
  const handleRegister = async(e) =>{
    e.preventDefault()
    const formData = new FormData(e.target)
    const{username, email, password, firstName, lastName,} = Object.fromEntries(formData);
    
    try{
      const res = await createUserWithEmailAndPassword(auth,email,password)
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        id: res.user.uid,
        firstName,
        lastName
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: []
      });

      toast.success("Te has registrado exitosamente!",{
        position: "bottom-right",})

    }catch(err){
      console.log(err);
    }

  }
  return (
    <div className='signup'>
      <div className='close'>
        <button className='close_button' onClick={closeModal}><CloseIcon fontSize='medium'></CloseIcon></button>
      </div>
        <div className="title">
            <h1>Regístrate</h1>
            <img src={yarnImg} alt="" />
        </div>
        <form onSubmit={handleRegister}className='signup_form'>
            <div className='formfield'>
            <input type="text" placeholder='Nombre(s)' name="firstName" required/>
            </div>
            <div className='formfield'>
            <input type="text" placeholder='Apellido(s)' name="lastName"  required/>
            </div>
            <div className='formfield'>
            <input type="text" placeholder='Usuario' name="username"  required/>
            </div>
            <div className='formfield'>
            <input type="email" placeholder='Correo electrónico' name="email"  required/>
            </div>
            <div className='formfield'>
            <input type="password" placeholder='Contraseña' name="password"  required/>
            </div>
            <button type='submit' className='signup_button'>¡Listo!</button>
        </form>
    </div>
  )
}

export default signup
