import React, { useState, useEffect, useRef } from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoIcon from '@mui/icons-material/Info';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Switch from '@mui/material/Switch';
import './chat.css';

import SentMessage from '../sent-message/sentMessage';
import ReceivedMessage from '../received-message/receivedMessage';

import { useChatStore } from '../../lib/chatStore';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';
import upload from "../../lib/upload";
import { useNavigate } from 'react-router-dom';

import CryptoJS from 'crypto-js'

import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat() {
  const navigate = useNavigate();
  const [task, setTask] = useState("");//el texto del input para mandar tasks
  const [tasks, setTasks] = useState([]); //el array de tasks
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const scrollRef = useRef(null);
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();
  const [img, setImg] = useState({ file: null, url: "" });
  const [incomingCall, setIncomingCall] = useState(null);
  const [points, setPoints] = useState(0); // Estado para almacenar los puntos
  const [lastMessageTime, setLastMessageTime] = useState(null); // Tiempo del último mensaje enviado
  const [openTask, setOpenTask] = useState(false);
  const [openSettings, setOpenSettings] = useState(false)
  const [encryption, setEncryption] = useState(false)

  const secretKey = import.meta.env.VITE_SECRET_KEY;


  const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
  };
  
  const decryptMessage = (cipherText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Error al desencriptar el mensaje", error);
      return cipherText;
    }
  };

  // Actualiza el estado de tareas cuando cambie el chat
  useEffect(() => {
    if (chat?.tasks) {
      setTasks(chat.tasks);
    }
  }, [chat]);

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
      setEncryption(res.data()?.encryption || false);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const scrollToBottom = () => {
    console.log(secretKey)
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

  useEffect(() => {
    const loadLastMessageTime = async () => {
      if (!chatId) return;
  
      const chatDoc = await getDoc(doc(db, "chats", chatId));
      if (chatDoc.exists()) {
        const messages = chatDoc.data().messages;
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage && lastMessage.createdAt) {
          setLastMessageTime(lastMessage.createdAt.toDate());
        }
      }
    };
  
    loadLastMessageTime();
  }, [chatId]);

const handleSend = async () => {
  if (text === "" && img.url === "") return;

  let imgUrl = null;
  let messageText = encryption ? encryptMessage(text) : text;

  try {
    if (img.file) {
      imgUrl = await upload(img.file);
    }

    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        senderId: currentUser.id,
        text: messageText,
        encrypted: encryption,
        createdAt: new Date(),
        ...(imgUrl && { img: imgUrl }),
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

const handleSendTask = async () => {
  if (task === "") return;

  try {
    // Envía el mensaje a Firebase
    await updateDoc(doc(db, "chats", chatId), {
      tasks: arrayUnion({
        task
      }),
    });


  } catch (err) {
    console.error("Error enviando tarea", err);
  }

  setTask("");
};
// Marcar como completada
const handleToggleTaskCompletion = async (index) => {
  const updatedTasks = [...tasks];
  updatedTasks[index].completed = !updatedTasks[index].completed;

  try {
    await updateDoc(doc(db, "chats", chatId), { tasks: updatedTasks });
  } catch (err) {
    console.error("Error actualizando tarea", err);
  }
};

// Eliminar tarea
const handleDeleteTask = async (index) => {
  const updatedTasks = tasks.filter((_, i) => i !== index);

  try {
    await updateDoc(doc(db, "chats", chatId), { tasks: updatedTasks });
  } catch (err) {
    console.error("Error eliminando tarea", err);
  }
};

const toggleTaskBar = () => {
  setOpenTask(prev => !prev);
  setOpenSettings(false)
};
const toggleSettings = () => {
  setOpenSettings(prev => !prev);
  setOpenTask(false)
};


const toggleEncryption = async () => {
  setEncryption((prev) => !prev);
  
  // Actualiza en Firebase el estado de encriptación
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, { encryption: !encryption });
};

  return (
    <div className="chat-super">
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
            <button onClick={toggleSettings}><InfoIcon /></button>
          </div>
        </div>
        <div className="chat_content" ref={scrollRef}>
          {chat?.messages?.map((message) => (
            <div key={message?.createdAt}>
              {message.senderId === currentUser.id ? (
                <SentMessage
                  msgImg={message.img}
                  msgText={message.encrypted ? decryptMessage(message.text) : message.text}
                  msgTime={new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  userImg={currentUser.avatar}
                />
              ) : (
                <ReceivedMessage
                  msgImg={message.img}
                  msgText={message.encrypted ? decryptMessage(message.text) : message.text}
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
            <button onClick={toggleTaskBar}><AddTaskIcon /></button>
          </div>
          <input type="text" placeholder='Escribe Aqui'
            value={text}
            onChange={(e) => setText(e.target.value)} />
          <button className="btn" onClick={handleSend}>Enviar <SendIcon /></button>
        </div> 
      </div>
     { openSettings &&  <div className="tasks-container chat-settings">
          <div className="settings">
            <h1>Ajustes del chat</h1>
            <span>
              <p>Encriptacion de mensajes: </p><Switch
              color="primary"
              checked={encryption} // Vincula el estado del switch con el tema oscuro
              onChange={toggleEncryption} // Maneja el cambio del switch
              />
            </span>
          </div>
        </div>}
     { openTask &&  <div className="tasks-container">
          <h1>Tareas</h1>
          <div className="tasks">
            {tasks.map((task, index) => (
              <div key={index} className="task">
                <input
                  type="checkbox"
                  checked={task.completed || false}
                  onChange={() => handleToggleTaskCompletion(index)}
                />
                <span>{task.task}</span>
                <button className='btn' onClick={() => handleDeleteTask(index)}>Delete</button>
              </div>
            ))}
          </div>
          <div className="chat_bar">
            <input
              type="text"
              placeholder='Escribe Aqui'
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button className="btn" onClick={handleSendTask}>Enviar <SendIcon /></button>
          </div>
        </div>}
    </div>
  );
}

export default Chat;
