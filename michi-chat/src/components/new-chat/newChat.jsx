import React, { useState } from 'react';
import './newChat.css';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify'; // Importar toast
import { 
  collection, getDocs, query, where, orderBy, 
  startAt, endAt, serverTimestamp, arrayUnion, 
  doc, setDoc, updateDoc, getDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';

function NewChat({ isOpen, closeModal }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    const username = e.target.value; 
    setSearchTerm(username);

    if (username.trim() === '') {
      setUsers([]);
      return;
    }

    try {
      const userRef = collection(db, 'users');
      const q = query(
        userRef, 
        orderBy('username'), 
        startAt(username), 
        endAt(username + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const foundUsers = querySnapshot.docs.map(doc => doc.data());
      setUsers(foundUsers);
    } catch (err) {
      console.error(err);
      toast.error('Error al buscar usuarios. Inténtalo de nuevo.');
    }
  };

  const handleAdd = async (selectedUser) => {
    if (selectedUser.id === currentUser.id) {
      toast.warning('No puedes crear un chat contigo mismo.');
      return;
    }
  
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
  
    try {
       // Verificar si el currentUser ya tiene un chat con el selectedUser
    const currentUserChatsDoc = await getDoc(doc(userChatsRef, currentUser.id));

    // Revisar los chats del currentUser
    if (currentUserChatsDoc.exists()) {
      const currentUserChats = currentUserChatsDoc.data().chats || [];
      
      const chatExists = currentUserChats.some(chat => chat.receiverId === selectedUser.id);

      if (chatExists) {
        toast.info('Ya tienes un chat con este usuario.');
        return;
      }
    }
  
      // Si no existe el chat, lo creamos
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
        participants: [currentUser.id, selectedUser.id],
      });
  
      // Actualizamos las referencias de los usuarios involucrados
      await updateDoc(doc(userChatsRef, selectedUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastmessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
  
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastmessage: "",
          receiverId: selectedUser.id,
          updatedAt: Date.now(),
        }),
      });
  
      toast.success('Chat creado exitosamente.');
    } catch (err) {
      console.error(err);
      toast.error('Error al crear el chat.');
    }
  };
  return (
    <div className="new-chat">
      <div className="new-chat-search">
        <TextField
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search..."
          className="custom-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 40 }} />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <div className="close">
          <button className="close_button" onClick={closeModal}>
            <CloseIcon fontSize="medium" />
          </button>
        </div>
      </div>
      <div className="new-chat-list">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className="new-chat-item">
              <img 
                src={user.avatar || 'src/assets/pictures/avatar-blank.png'} 
                alt="" 
              />
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
