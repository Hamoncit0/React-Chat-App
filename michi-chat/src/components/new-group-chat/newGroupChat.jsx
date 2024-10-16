import React, { useState, useEffect } from 'react';
import './newGroupChat.css';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, doc, setDoc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';

function newGroupChat({ isOpen, closeModal }) {
  const [users, setUsers] = useState([]); 
  const [selectedUsers, setSelectedUsers] = useState([]); 
  const { currentUser } = useUserStore(); 

  useEffect(() => {
    const fetchUsers = async () => {
      const userCollection = collection(db, 'users'); 
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  
  const handleUserSelect = (user) => {
    if (selectedUsers.length < 5 && !selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  
  const handleUserRemove = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter(user => user !== userToRemove));
  };

  
  const handleCreateGroupChat = async () => {
    if (selectedUsers.length >= 3) {
      try {
        
        const chatRef = collection(db, 'chats');
        const newChatRef = doc(chatRef); 

        
        await setDoc(newChatRef, {
          createdAt: serverTimestamp(),
          members: selectedUsers.map(user => user.id).concat(currentUser.id), // Incluir al usuario actual
          isGroupChat: true,
          messages: []
        });

       
        await updateDoc(doc(db, 'userchats', currentUser.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: '',
            isGroupChat: true,
            updatedAt: Date.now()
          })
        });

        
        for (const user of selectedUsers) {
          await updateDoc(doc(db, 'userchats', user.id), {
            chats: arrayUnion({
              chatId: newChatRef.id,
              lastMessage: '',
              isGroupChat: true,
              updatedAt: Date.now()
            })
          });
        }

        closeModal(); 
      } catch (err) {
        console.error('Error al crear el grupo de chat:', err);
      }
    }
  };

  return (
    <div className='new-group-chat'>
      <div className='new-chat-search'>
        <TextField
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

      <div className='new-groupchat-list'>
        {users.map((user) => (
          <div key={user.id} className='new-groupchat-item'>
            <img 
              src={user.avatar || 'src/assets/pictures/avatar-blank.png'} 
              alt={`${user.username}'s avatar`} 
              className='user-avatar' 
            />
            <h2>{user.username}</h2>
            <button className='btn' onClick={() => handleUserSelect(user)}>
              <AddIcon />
            </button>
          </div>
        ))}
      </div>

      <div className="new-group-list">
        <div className="items">
          {selectedUsers.map((user) => (
            <div key={user.id} className="gc-new-item">
              <h4>{user.username}</h4>
              <CloseIcon className='btn-cerrar' onClick={() => handleUserRemove(user)} />
            </div>
          ))}
        </div>
        <button className='btn' disabled={selectedUsers.length < 3} onClick={handleCreateGroupChat}>
          Crear groupchat
        </button>
      </div>
    </div>
  );
}

export default newGroupChat;