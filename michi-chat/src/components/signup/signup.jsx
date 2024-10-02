import React, { useState } from 'react';
import './signup.css';
import yarnImg from '../../assets/yarn.png';
import CloseIcon from '@mui/icons-material/Close';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress'; 
import upload from '../../lib/upload';

function Signup({ isOpen, closeModal, children }) {
  const [loading, setLoading] = useState(false); // Loading state

  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({}); // To track validation errors

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.firstName) {
      errors.firstName = "Nombre(s) es obligatorio.";
    }
    if (!formData.lastName) {
      errors.lastName = "Apellido(s) es obligatorio.";
    }
    if (!formData.username) {
      errors.username = "Usuario es obligatorio.";
    }
    if (!formData.email) {
      errors.email = "Correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Correo electrónico no es válido.";
    }
    if (!formData.password) {
      errors.password = "Contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const { username, email, password, firstName, lastName } = formData;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        firstName,
        lastName,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Te has registrado exitosamente!", {
        position: "bottom-right",
      });

    } catch (err) {
      console.log(err);
      toast.error("No se ha podido registrar :(", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signup'>
      <div className='close'>
        <button className='close_button' onClick={closeModal}><CloseIcon fontSize='medium' /></button>
      </div>
      <div className="title">
        <h1>Regístrate</h1>
        <img src={yarnImg} alt="" />
      </div>
      <form onSubmit={handleRegister} className='signup_form'>
        <div className='formfield'>
          <input name="file" type="file" id="file" onChange={handleAvatar}  />
        </div>

        <div className='formfield'>
          <input
            type="text"
            placeholder='Nombre(s)'
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            
          />
        </div>
          {errors.firstName && <small className='error'>{errors.firstName}</small>}

        <div className='formfield'>
          <input
            type="text"
            placeholder='Apellido(s)'
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            
          />
        </div>
          {errors.lastName && <small className='error'>{errors.lastName}</small>}

        <div className='formfield'>
          <input
            type="text"
            placeholder='Usuario'
            name="username"
            value={formData.username}
            onChange={handleChange}
            
          />
        </div>
          {errors.username && <small className='error'>{errors.username}</small>}

        <div className='formfield'>
          <input
            type="email"
            placeholder='Correo electrónico'
            name="email"
            value={formData.email}
            onChange={handleChange}
            
          />
        </div>
          {errors.email && <small className='error'>{errors.email}</small>}

        <div className='formfield'>
          <input
            type="password"
            placeholder='Contraseña'
            name="password"
            value={formData.password}
            onChange={handleChange}
            
          />
        </div>
          {errors.password && <small className='error'>{errors.password}</small>}

        <button type="submit" className="signup_button" disabled={loading}>
          {!loading ? "¡Listo!" : <CircularProgress size={24} />} {/* Spinner */}
        </button>
      </form>
    </div>
  );
}

export default Signup;
