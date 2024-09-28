import React, { useEffect, useState } from 'react'
import './main-page.css'

import Chat from '../chat/chat'
import Header from '../header/header'
import NewChat from '../new-chat/newChat'
import ChatBox from '../chat-box/chatBox'


import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';


import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore'
import { useChatStore } from '../../lib/chatStore'


function mainPage() {
  //new chat modal
  const [modal, setModal] = useState(false);

  const toggleModal = ()=>{
    setModal(!modal)
  }

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
    changeChat(chat.chatId, chat.user);
  };



  return (
    <div className='mainpage'>
      <div>
        <Header></Header>
      </div>
      <div className={`login ${modal ? 'blur-background' : ''} main`}>
        
      <div className="chat_list">
        <div className="search">
          <button onClick={toggleModal}><AddToPhotosIcon sx={{ fontSize: 40 }}></AddToPhotosIcon></button>
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
            time={new Date(chat.updatedAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    </div>
  )
}

export default mainPage
