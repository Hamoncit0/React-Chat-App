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
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';


function chat() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const scrollRef = useRef(null);
  const {chatId, user} = useChatStore();
  const {currentUser} = useUserStore();
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

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

 
  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally{
    setImg({
      file: null,
      url: "",
    });

    setText("");
    }
  };
  return (
    <div className='chat'>
      <div className="chat_name">
        <h2>{user.username}</h2>
        <div className="chat_options">
          <button><VideocamIcon></VideocamIcon></button>
          <button><CallIcon></CallIcon></button>
        </div>
      </div>
      
      <div className="chat_content" ref={scrollRef} >
        {chat?.messages?.map((message) => (
          <div key={message?.createdAt}>
            {message.senderId === currentUser.id ?(
              
            <SentMessage 
              msgImg={message.img} 
              msgText={message.text} 
              msgTime={new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              userImg={currentUser.avatar} />
            ):(
              
            <ReceivedMessage 
              msgImg={message.img} 
              msgText={message.text} 
              msgTime={new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              userImg={user.avatar} />
            )

            }
          </div>
          
        ))

        }
      </div>
      <div className="chat_bar" >
        <div className="chat_options">
          <button><AttachFileIcon></AttachFileIcon></button>
          <button><AddTaskIcon></AddTaskIcon></button>
        </div>
        <input type="text" placeholder='Escribe Aqui'
          value={text}
          onChange={(e) => setText(e.target.value)} />
          <button className="btn" onClick={handleSend}>Enviar <SendIcon></SendIcon></button>
      </div>

    </div>
  )
}

export default chat
