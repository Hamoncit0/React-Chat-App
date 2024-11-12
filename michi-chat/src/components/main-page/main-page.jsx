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

const socket = io('http://localhost:5000');

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


  const toggleModal = () => {
    setModal(!modal);
    handleClose();
  };

  const toggleGroupModal = () => {
    setGroupModal(!groupModal);
    handleClose();
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats;
  
      const promises = items.map(async (item) => {
        if (item.isGroupChat) {
          // Recuperar el documento del chat grupal desde Firebase
          const groupChatDoc = await getDoc(doc(db, 'chats', item.chatId));
          const groupChatData = groupChatDoc.data();
          
          return {
            ...item,
            groupName: groupChatData.groupName || 'Chat grupal', // Usar el nombre del grupo o un valor por defecto
            groupMembers: groupChatData.members || [],
            groupImage: groupChatData.groupImage || ''
          };
        } else {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = getDoc(userDocRef);
          const user = (await userDocSnap).data();
          
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
  
    return () => {
      unSub();
    };
  }, [currentUser.id]);
  

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
