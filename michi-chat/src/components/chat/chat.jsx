import React, { useState } from 'react'
import './chat.css'
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { useRef, useEffect } from 'react';
import AddTaskIcon from '@mui/icons-material/AddTask';
import SentMessage from '../sent-message/sentMessage';
import ReceivedMessage from '../received-message/receivedMessage';
import { useChatStore } from '../../lib/chatStore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';


function chat() {
  const [chat, setChat] = useState();
  const scrollRef = useRef(null);
  const {chatId} = useChatStore();

  // Desplázate al final del div cuando el componente se renderice o el contenido cambie
  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (!chatId) return; // Asegúrate de que chatId esté definido
  
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
  
    return () => {
      unSub();
    };
  }, [chatId]);
  
  // Función para desplazar el scroll al final del div
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const enviar = () =>{
  }
  return (
    <div className='chat'>
      <div className="chat_name">
        <h2>el gato</h2>
        <div className="chat_options">
          <button><VideocamIcon></VideocamIcon></button>
          <button><CallIcon></CallIcon></button>
        </div>
      </div>
      
      <div className="chat_content" ref={scrollRef} >
        
        <SentMessage/>
        <ReceivedMessage/>
      </div>
      <div className="chat_bar" >
        <div className="chat_options">
          <button><AttachFileIcon></AttachFileIcon></button>
          <button><AddTaskIcon></AddTaskIcon></button>
        </div>
        <input type="text" placeholder='Escribe Aqui' />
          <button className="btn" onClick={enviar}>Enviar <SendIcon></SendIcon></button>
      </div>

    </div>
  )
}

export default chat
