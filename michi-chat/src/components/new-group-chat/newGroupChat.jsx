import React, { useState, useEffect } from 'react';
import './newGroupChat.css';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, doc, setDoc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';
import { toast } from 'react-toastify';
import upload from "../../lib/upload";

function NewGroupChat({ isOpen, closeModal }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState('');
  const [step, setStep] = useState(1); // Paso 1: Nombre y foto del grupo, Paso 2: Selección de usuarios
  const { currentUser } = useUserStore();
  const [groupImg, setGroupImg] = useState({ file: null, url: "" });

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

  const handleImgGroup = (e) => {
    if (e.target.files[0]) {
      setGroupImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleUserRemove = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter(user => user !== userToRemove));
  };

  const handleCreateGroupChat = async () => {
    console.log("huuh")
    if (selectedUsers.length >= 3 && groupName) {
      try {

        let imgUrl = null;

        if (groupImg.file) {
          imgUrl = await upload(groupImg.file);
        }

        const chatRef = collection(db, 'chats');
        const newChatRef = doc(chatRef);

        await setDoc(newChatRef, {
          createdAt: serverTimestamp(),
          members: selectedUsers.map(user => user.id).concat(currentUser.id),
          isGroupChat: true,
          groupName,
          ...(imgUrl && { groupImage: imgUrl }),
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
      }finally{
        setGroupImg({
          file: null,
          url: "",
         });
      }
    }
    else{
      toast.error("Necesitas minimo 3 integrantes para crear un chat grupal", {
      });
    }
  };

  const handleNextStep = () => {
    if (groupName) setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  return (
    <div className='new-group-chat'>
      {step === 1 ? (
        <div className='group-info'>
          <input
            className='newChatFieldInput'
            placeholder="Nombre del grupo"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <input
          className='uploadImgGroup'
            type='file'
            name="group-photo" 
            id="group-photo" 
            onChange={handleImgGroup}
            placeholder="URL de la imagen del grupo"
            value={groupImage}
          />
          <label className='btn selectImgGroup' htmlFor="group-photo">Upload Group Image</label>
          {groupImg.url && (
          <div className="groupImg-previewGroup">
            <p>Img preview:</p>
            <img src={groupImg.url} alt="" />
          </div>
        )}
          <button
            onClick={handleNextStep}
            className='btn'
            disabled={!groupName}
          >
            Siguiente
          </button>
        </div>
      ) : (
        <>
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
            <button className='btn' onClick={handlePreviousStep}>
              Regresar
            </button>
            <div className="items">
              {selectedUsers.map((user) => (
                <div key={user.id} className="gc-new-item">
                  <h4>{user.username}</h4>
                  <CloseIcon className='btn-cerrar' onClick={() => handleUserRemove(user)} />
                </div>
              ))}
            </div>
            <button className='btn' onClick={handleCreateGroupChat}>
              Crear grupo de chat
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default NewGroupChat;
