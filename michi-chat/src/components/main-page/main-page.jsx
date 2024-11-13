import React, { useEffect, useState } from 'react';
import './main-page.css';

import Chat from '../chat/chat';
import Header from '../header/header';
import NewChat from '../new-chat/newChat';
import NewGroupChat from '../new-group-chat/newGroupChat';
import ChatBox from '../chat-box/chatBox';

import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import io from 'socket.io-client';

const socket = io('https://socket-io-call.onrender.com');

function MainPage() {
  const [modal, setModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const { currentUser } = useUserStore();
  const { changeChat, chatId } = useChatStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [incomingCall, setIncomingCall] = useState(null);
  const navigate = useNavigate();
  const [filteredChats, setFilteredChats] = useState([]); // Estado para los chats filtrados
  const [searchTerm, setSearchTerm] = useState(''); 
  const [usersOnlineStatus, setUsersOnlineStatus] = useState({});

  ///////////////////////LLAMADASSSS///////////////////////////
  useEffect(() => {
    // Envía el userId al servidor al conectarse
    socket.emit('register-user', currentUser.id);

    socket.on('incoming-call', async({ callerId, roomId }) => {
      // Obtén el nombre del usuario desde Firebase
      const userDoc = await getDoc(doc(db, "users", callerId));
      const callerName = userDoc.exists() ? userDoc.data().username : 'Unknown Caller';
      
      setIncomingCall({ callerId, roomId, callerName });
    });

    return () => {
      socket.off('incoming-call');
    };
}, [currentUser.id]);


  const acceptCall = () => {
    if (incomingCall) {
      navigate(`/call/${incomingCall.roomId}/${incomingCall.callerName}/${currentUser.username}`);
      setIncomingCall(null);
    }
  };
////////////////SE TERMINAN LLAMADAS//////////////////

//////////////////////FUNCIONES DE LISTA DE CHAT//////////////////////////////////////////

// Función para manejar el cambio en el campo de búsqueda
const handleSearchChange = (event) => {
  const value = event.target.value;
  setSearchTerm(value);

  if (value === '') {
    // Si el campo de búsqueda está vacío, muestra todos los chats
    setFilteredChats(chats);
  } else {
    // Filtra los chats por nombre de usuario o de grupo según el término de búsqueda
    const filtered = chats.filter((chat) =>
      chat.isGroupChat
        ? chat.groupName.toLowerCase().includes(value.toLowerCase())
        : chat.user?.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredChats(filtered);
  }
};


useEffect(() => {
    // Cuando se actualicen los chats, también se actualizan los chats filtrados
    setFilteredChats(chats);
}, [chats]);
const handleSelect = async (chat) => {
  const chatIndex = chats.findIndex((item) => item.chatId === chat.chatId);
  chats[chatIndex].isSeen = true;

  const userChatsRef = doc(db, "userchats", currentUser.id);

  try {
    await updateDoc(userChatsRef, {
      chats: chats,
    });

    if (chat.isGroupChat) {
      changeChat(chat.chatId, { groupName: chat.groupName, members: chat.groupMembers, blocked: [] });
    } else {
      changeChat(chat.chatId, chat.user);
    }
  } catch (err) {
    console.log(err);
  }
};
 // Suscripción a los cambios en `chats` y actualización del estado de conexión en tiempo real
 useEffect(() => {
  const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
    const items = res.data().chats;

    // Procesar cada chat para obtener información del usuario o grupo
    const promises = items.map(async (item) => {
      if (item.isGroupChat) {
        const groupChatDoc = await getDoc(doc(db, 'chats', item.chatId));
        const groupChatData = groupChatDoc.data();
        return {
          ...item,
          groupName: groupChatData.groupName || 'Chat grupal',
          groupImage: groupChatData.groupImage || '',
        };
      } else {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();
        // Escuchar cambios en el estado de conexión del usuario
        if (!usersOnlineStatus.hasOwnProperty(item.receiverId)) {
          listenUserOnlineStatus(item.receiverId);
        }
        return {
          ...item,
          user: {
            ...user,
            activeHat: user?.activeHat || null,
          },
        };
      }
    });

    const chatData = await Promise.all(promises);
    setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
  });

  return () => unSub();
}, [currentUser.id, usersOnlineStatus]);


//////////////////////////////SE TERMINAN FUNCIONES DE LISTA DE CHATS////////////////////////////

/////////////////////////////MODALES PARA CREAR NUEVOS CHATS//////////////////////////
  const toggleModal = () => {
    setModal(!modal);
    handleClose();
  };

  const toggleGroupModal = () => {
    setGroupModal(!groupModal);
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  ////////////////////////////SE TERMINAN FUNCIONES PARA MODALES DE CREAR CHATS/////////////////////
/////////////////////////////////STATUSSS////////////////////////////////////////////
const listenUserOnlineStatus = (userId) => {
  return onSnapshot(doc(db, 'users', userId), (docSnapshot) => {
    const userData = docSnapshot.data();

    if (userData && userData.isOnline !== usersOnlineStatus[userId]) {
      setUsersOnlineStatus((prevState) => ({
        ...prevState,
        [userId]: userData.isOnline,
      }));
    }
  });
};
// Función para escuchar cambios de conexión del usuario actual
useEffect(() => {
  // Escucha los cambios en el documento del usuario
  const unSubStatus = onSnapshot(doc(db, 'users', currentUser.id), (docSnapshot) => {
    const userData = docSnapshot.data();

    // Solo actualiza si `isOnline` cambió
    if (userData && userData.isOnline !== usersOnlineStatus[currentUser.id]) {
      setUsersOnlineStatus((prevState) => ({
        ...prevState,
        [currentUser.id]: userData.isOnline,
      }));
    }
  });

  return () => {
    unSubStatus(); // Detener la escucha al desmontar el componente
  };
}, [currentUser.id, usersOnlineStatus]);

useEffect(() => {
  // Establecer estado en línea al abrir la pestaña
  const userRef = doc(db, 'users', currentUser.id);
  updateDoc(userRef, { isOnline: true });

  // Cambiar a offline al cerrar la pestaña
  const handleTabClose = async () => {
    await updateDoc(userRef, { isOnline: false });
  };
  window.addEventListener('beforeunload', handleTabClose);

  // Limpieza del evento al desmontar el componente
  return () => {
    window.removeEventListener('beforeunload', handleTabClose);
    updateDoc(userRef, { isOnline: false });
  };
}, [currentUser.id]);


  return (
    <div className='mainpage'>
      <Header />
      {incomingCall && (
          <div className="call-notification">
            <p>Incoming call from {incomingCall.callerName}</p>
            <button className='btn' onClick={acceptCall}>Accept Call</button>
          </div>
        )}
      <div className={`login ${modal || groupModal ? 'blur-background' : ''} main`}>
        <div className="chat_list">
          <div className="search">
            <button 
              id="chat-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <AddToPhotosIcon sx={{ fontSize: 40 }} />
            </button>
            <TextField
            value={searchTerm}
             onChange={handleSearchChange}
              placeholder="Search..."
              className="custom-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 40 }}/>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </div>

          <div className="list">
            {/* Render chat list */}
            {filteredChats.map((chat) => (
              <div onClick={() => handleSelect(chat)} key={chat.chatId}>
                {chat.isGroupChat ? (
                  <ChatBox
                    chatName={chat.groupName}
                    lastMessage={chat.lastMessage}
                    seen={chat.isSeen}
                    time={new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    chatPicture={chat.groupImage || '/path-to-group-avatar.png'}
                    groupchat={true}
                  />
                ) : (
                  chat.user ? (
                    <ChatBox
                      chatName={chat.user.username}
                      lastMessage={chat.lastMessage}
                      seen={chat.isSeen}
                      time={new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      chatPicture={chat.user.avatar}
                      activeHat={chat.user.activeCosmetic}
                      isOnline={chat.user.isOnline}
                    />
                  ) : (
                    <div>No se pudo cargar la información del usuario</div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="chat_space">
          {chatId && <Chat chatId={chatId} />}
        </div>
      </div>

      {modal && (
        <div className="modal">
          <div className="overlay">
            <NewChat closeModal={toggleModal} />
          </div>
        </div>
      )}

      {groupModal && (
        <div className="modal">
          <div className="overlay">
            <NewGroupChat 
              closeModal={toggleGroupModal}
            />
          </div>
        </div>
      )}

      <Menu
        className='dropdown-menu'
        id="chat-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={toggleModal}>Chat nuevo</MenuItem>
        <MenuItem onClick={toggleGroupModal}>Chat grupal nuevo</MenuItem>
      </Menu>
    </div>
  );
}

export default MainPage;
