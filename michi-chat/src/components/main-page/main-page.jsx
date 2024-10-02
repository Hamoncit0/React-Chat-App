import React, { useEffect, useState } from 'react'
import './main-page.css'

import Chat from '../chat/chat'
import Header from '../header/header'
import NewChat from '../new-chat/newChat'
import NewGroupChat from '../new-group-chat/newGroupChat'
import ChatBox from '../chat-box/chatBox'


import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';


import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore'
import { useChatStore } from '../../lib/chatStore'


import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


function mainPage() {
  //new chat modal
  const [modal, setModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);

  const toggleModal = ()=>{
    setModal(!modal)
    handleClose();
  }

  const toggleGroupModal = () => {
    setGroupModal(!groupModal);
    handleClose();
  };
  //chats
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const {currentUser} = useUserStore();
  const {changeChat} = useChatStore();
  const {chatId} = useChatStore();

  useEffect(()=>{
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res)=>{
      const items = res.data().chats;

      const promises = items.map(async (item)=>{
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = getDoc(userDocRef);

        const user = (await userDocSnap).data();
        return{...item, user};
      });
      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt));

    });
    return ()=>{
      unSub();
    }
  }, [currentUser.id])

  const handleSelect = async (chat) => { // Verificar si chatId y user están presentes
   
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };
  ////////////DROPDOWN MENU//////////
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div className='mainpage'>
      <div>
        <Header></Header>
      </div>
      <div className={`login ${modal || groupModal ? 'blur-background' : ''} main`}>
        
      <div className="chat_list">
        <div className="search">
          <button 
          id="chat-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          ><AddToPhotosIcon sx={{ fontSize: 40 }}></AddToPhotosIcon></button>
        <TextField
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
        {chats.map((chat)=>(
          <div onClick={() => handleSelect(chat)} key={chat.chatId}>
            <ChatBox
            chatName={chat.user.username} 
            lastMessage={chat.lastMessage}
            seen={chat.isSeen}
            time={new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            chatPicture={chat.user.avatar}/>
          </div>
          
        ))}

      </div>

        <div className="chat_space">
          {chatId && <Chat></Chat>}
        </div>
      </div>
      {modal && (
        <div className="modal">
              <div className="overlay">
                <NewChat closeModal={toggleModal}></NewChat>
              </div>
        </div>
      )}
      {groupModal && (
        <div className="modal">
              <div className="overlay">
                <NewGroupChat closeModal={toggleGroupModal}></NewGroupChat>
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

  )
}

export default mainPage
