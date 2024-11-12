import React, { useState, useEffect, useRef } from 'react';
import './chat.css';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import AddTaskIcon from '@mui/icons-material/AddTask';
import SentMessage from '../sent-message/sentMessage';
import ReceivedMessage from '../received-message/receivedMessage';
import { useChatStore } from '../../lib/chatStore';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';
import upload from "../../lib/upload";
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const scrollRef = useRef(null);
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();
  const [img, setImg] = useState({ file: null, url: "" });
  const [incomingCall, setIncomingCall] = useState(null);
  const [points, setPoints] = useState(0); // Estado para almacenar los puntos
  const [lastMessageTime, setLastMessageTime] = useState(null); // Tiempo del último mensaje enviado

  useEffect(() => {
    // Envía el userId al servidor al conectarse
    socket.emit('register-user', currentUser.id);

    socket.on('incoming-call', ({ callerId, roomId }) => {
      setIncomingCall({ callerId, roomId });
    });

    return () => {
      socket.off('incoming-call');
    };
  }, [currentUser.id]);

  const startVideoCall = () => {
    socket.emit('call-user', {
      callerId: currentUser.id,
      receiverId: user.id,
      roomId: user.id,
    });
    navigate(`/call/${user.id}`);
  };

  const acceptCall = () => {
    if (incomingCall) {
      navigate(`/call/${incomingCall.roomId}`);
      setIncomingCall(null);
    }
  };

  useEffect(() => {
    if (chat?.messages) {
      scrollToBottom();
    }
  }, [chat?.messages]);

  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
 // Cargar puntos iniciales desde Firebase
 useEffect(() => {
    const loadPoints = async () => {
      const userRef = doc(db, "users", currentUser.id);
      const userDoc = await getDoc(userRef);
      setPoints(userDoc.data()?.points || 0);
    };
    loadPoints();
  }, [currentUser.id]);

const handleSend = async () => {
  if (text === "") return;

  try {
    // Envía el mensaje a Firebase
    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        senderId: currentUser.id,
        text,
        createdAt: new Date(),
      }),
    });

    const now = new Date();
    if (!lastMessageTime || (now - lastMessageTime) >= 60000) {
      // Incrementar puntos y actualizarlos en Firebase
      const newPoints = points + 30;
      setPoints(newPoints);
      setLastMessageTime(now)
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, { points: newPoints });
    }


  } catch (err) {
    console.error("Error enviando mensaje o actualizando puntos", err);
  }

  setText("");
};


  return (
    <div className='chat'>
      {incomingCall && (
        <div className="call-notification">
          <p>Incoming call from {incomingCall.callerId}</p>
          <button onClick={acceptCall}>Accept Call</button>
        </div>
      )}
      <div className="chat_name">
        <h2>{user.username}</h2>
        <div className="chat_options">
          <button onClick={startVideoCall}><VideocamIcon /></button>
          <button><CallIcon /></button>
        </div>
      </div>
      <div className="chat_content" ref={scrollRef}>
        {chat?.messages?.map((message) => (
          <div key={message?.createdAt}>
            {message.senderId === currentUser.id ? (
              <SentMessage
                msgImg={message.img}
                msgText={message.text}
                msgTime={new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                userImg={currentUser.avatar}
              />
            ) : (
              <ReceivedMessage
                msgImg={message.img}
                msgText={message.text}
                msgTime={new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                userImg={user.avatar}
              />
            )}
          </div>
        ))}
      </div>
      {img.url && (
        <div className="img-preview">
          <p>Img preview:</p>
          <img src={img.url} alt="" />
        </div>
      )}
      <div className="chat_bar">
        <div className="chat_options">
          <input type="file" name="file-upload" id="file-upload" onChange={handleImg} />
          <label htmlFor="file-upload"><AttachFileIcon /></label>
          <button><AddTaskIcon /></button>
        </div>
        <input type="text" placeholder='Escribe Aqui'
          value={text}
          onChange={(e) => setText(e.target.value)} />
        <button className="btn" onClick={handleSend}>Enviar <SendIcon /></button>
      </div>
      <div className="points-display">Puntos: {points}</div> {/* Mostrando los puntos */}
    </div>
  );
}

export default Chat;
