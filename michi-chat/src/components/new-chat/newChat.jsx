import React, { useState } from 'react';
import './newChat.css';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, orderBy, startAt, endAt, serverTimestamp, arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../../lib/userStore';

function NewChat({ isOpen, closeModal, children }) {

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Cambié de 'user' a 'users' para manejar múltiples resultados
  const [searchTerm, setSearchTerm] = useState('');
  const {currentUser} = useUserStore();


  const handleSearch = async (e) => {
    const username = e.target.value; // Convertir el término de búsqueda a minúsculas
    setSearchTerm(username);

    if (username.trim() === '') {
      setUsers([]); // Limpiar la lista si no hay texto
      return;
    }

    try {
      const userRef = collection(db, 'users');

      // Realizar la búsqueda parcial, Firestore no tiene LIKE, pero podemos simularlo
      const q = query(
        userRef, 
        orderBy('username'), 
        startAt(username), 
        endAt(username + '\uf8ff') // \uf8ff es el carácter Unicode más alto para garantizar coincidencias
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        setUser(null); // Si no se encuentran usuarios
      }


      const foundUsers = querySnapshot.docs.map(doc => doc.data());
      setUsers(foundUsers); // Almacenar todos los usuarios encontrados

    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async(selectedUser)=>{
    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchats")

    try{
        const newChatRef = doc(chatRef);
        await setDoc(newChatRef, {
            createdAt: serverTimestamp(),
            messages: [],
        });

        await updateDoc(doc(userChatsRef, selectedUser.id),{
            chats: arrayUnion({
                chatId: newChatRef.id,
                lastmessage: "",
                receiverId: currentUser.id,
                updatedAt: Date.now()
            })
        });
        
        await updateDoc(doc(userChatsRef, currentUser.id),{
            chats: arrayUnion({
                chatId: newChatRef.id,
                lastmessage: "",
                receiverId: selectedUser.id,
                updatedAt: Date.now()
            })
        })
    }catch(err){
        console.log(err);
    }
  }
  return (
    <div className='new-chat'>
      <div className='new-chat-search'>
        <TextField
          value={searchTerm}
          onChange={handleSearch}
          placeholder='Search...'
          className='custom-input'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ fontSize: 40 }} />
              </InputAdornment>
            ),
          }}
          variant='outlined'
        />
        <div className='close'>
          <button className='close_button' onClick={closeModal}>
            <CloseIcon fontSize='medium' />
          </button>
        </div>
      </div>
      <div className='new-chat-list'>
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className='new-chat-item'>
              <img src={user.avatar || 'src/assets/pictures/avatar-blank.png'} alt='' />
              <h2>{user.username}</h2>
              <button onClick={() => handleAdd(user)} className='btn'>Enviar mensaje</button>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}

export default NewChat;
