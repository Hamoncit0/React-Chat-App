import React from 'react'
import './chat.css'
import elgato from '../../assets/pictures/elgato.png'
import magicbara from '../../assets/pictures/magicbara.png'
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
function chat() {
  const scrollRef = useRef(null);

  // Desplázate al final del div cuando el componente se renderice o el contenido cambie
  useEffect(() => {
    scrollToBottom();
  }, []);

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
        <div className="msg">
          <div className="receptor_img">
            <img src={elgato} alt="" />
          </div>
          <div className="msg_content">
            <div className="msg_text">
              <p>ESTOY MAMADISIMO WEY</p>
            </div>
            <div className="msg_time">
              <span>11:20am</span>
            </div>
          </div>
        </div>
        <div className="msg">
          <div className="receptor_img">
            <img src={elgato} alt="" />
          </div>
          <div className="msg_content">
            <div className="msg_text">
              <p>ESTOY MAMADISIMO WEY</p>
            </div>
            <div className="msg_time">
              <span>11:20am</span>
            </div>
          </div>
        </div>
        <div className="msg">
          <div className="receptor_img">
            <img src={elgato} alt="" />
          </div>
          <div className="msg_content">
            <div className="msg_text">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum dolorum hic, est ab perferendis dignissimos doloremque accusamus assumenda itaque voluptatum et nemo labore quibusdam ducimus accusantium alias praesentium. Inventore repellat aspernatur impedit facere natus vel voluptas. Fugit quod commodi numquam accusamus sequi perspiciatis, minus veniam velit exercitationem quidem aut deserunt vel aliquid! Similique eveniet asperiores quam quaerat natus eius nobis optio nisi corporis quod. Minima at dignissimos culpa voluptatibus nisi consequuntur temporibus cumque assumenda corporis odio debitis neque sapiente laudantium consectetur, libero quis nostrum unde fugiat velit vero perspiciatis cum distinctio sit. Eaque voluptatum aliquid nemo. Consequatur placeat ea minus.</p>
            </div>
            <div className="msg_time">
              <span>11:20am</span>
            </div>
          </div>
        </div>
        <div className="msg-sender">
          <div className="msg_content_sender">
            <div className="msg_text">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum dolorum hic, est ab perferendis dignissimos doloremque accusamus assumenda itaque voluptatum et nemo labore quibusdam ducimus accusantium alias praesentium. Inventore repellat aspernatur impedit facere natus vel voluptas. Fugit quod commodi numquam accusamus sequi perspiciatis, minus veniam velit exercitationem quidem aut deserunt vel aliquid! Similique eveniet asperiores quam quaerat natus eius nobis optio nisi corporis quod. Minima at dignissimos culpa voluptatibus nisi consequuntur temporibus cumque assumenda corporis odio debitis neque sapiente laudantium consectetur, libero quis nostrum unde fugiat velit vero perspiciatis cum distinctio sit. Eaque voluptatum aliquid nemo. Consequatur placeat ea minus.</p>
            </div>
            <div className="msg_time">
              <span>11:20am</span>
            </div>
          </div>
          <div className="receptor_img" >
            <img src={magicbara} alt="" />
          </div>
        </div>
        <div className="msg-sender">
          <div className="msg_content_sender">
            <div className="msg_text">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum dolorum hic, est ab perferendis dignissimos doloremque accusamus assumenda itaque voluptatum et nemo labore quibusdam ducimus accusantium alias praesentium. Inventore repellat aspernatur impedit facere natus vel voluptas. Fugit quod commodi numquam accusamus sequi perspiciatis, minus veniam velit exercitationem quidem aut deserunt vel aliquid! Similique eveniet asperiores quam quaerat natus eius nobis optio nisi corporis quod. Minima at dignissimos culpa voluptatibus nisi consequuntur temporibus cumque assumenda corporis odio debitis neque sapiente laudantium consectetur, libero quis nostrum unde fugiat velit vero perspiciatis cum distinctio sit. Eaque voluptatum aliquid nemo. Consequatur placeat ea minus.</p>
            </div>
            <div className="msg_time">
              <span>11:20am</span>
            </div>
          </div>
          <div className="receptor_img" >
            <img src={magicbara} alt="" />
          </div>
        </div>
        <div className="msg-sender">
          <div className="msg_content_sender">
            <div className="msg_text">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum dolorum hic, est ab perferendis dignissimos doloremque accusamus assumenda itaque voluptatum et nemo labore quibusdam ducimus accusantium alias praesentium. Inventore repellat aspernatur impedit facere natus vel voluptas. Fugit quod commodi numquam accusamus sequi perspiciatis, minus veniam velit exercitationem quidem aut deserunt vel aliquid! Similique eveniet asperiores quam quaerat natus eius nobis optio nisi corporis quod. Minima at dignissimos culpa voluptatibus nisi consequuntur temporibus cumque assumenda corporis odio debitis neque sapiente laudantium consectetur, libero quis nostrum unde fugiat velit vero perspiciatis cum distinctio sit. Eaque voluptatum aliquid nemo. Consequatur placeat ea minus.</p>
            </div>
            <div className="msg_time">
              <span>11:20am</span>
            </div>
          </div>
          <div className="receptor_img" >
            <img src={magicbara} alt="" />
          </div>
        </div>
        <div className="msg-sender">
          <div className="msg_content_sender">
            <div className="msg_text">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum dolorum hic, est ab perferendis dignissimos doloremque accusamus assumenda itaque voluptatum et nemo labore quibusdam ducimus accusantium alias praesentium. Inventore repellat aspernatur impedit facere natus vel voluptas. Fugit quod commodi numquam accusamus sequi perspiciatis, minus veniam velit exercitationem quidem aut deserunt vel aliquid! Similique eveniet asperiores quam quaerat natus eius nobis optio nisi corporis quod. Minima at dignissimos culpa voluptatibus nisi consequuntur temporibus cumque assumenda corporis odio debitis neque sapiente laudantium consectetur, libero quis nostrum unde fugiat velit vero perspiciatis cum distinctio sit. Eaque voluptatum aliquid nemo. Consequatur placeat ea minus.</p>
            </div>
            <div className="msg_time">
              <span>11:20am</span>
            </div>
          </div>
          <div className="receptor_img" >
            <img src={magicbara} alt="" />
          </div>
        </div>
        <div className="msg-sender">
          <div className="msg_content_sender">
            <div className="msg_text">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum dolorum hic, est ab perferendis dignissimos doloremque accusamus assumenda itaque voluptatum et nemo labore quibusdam ducimus accusantium alias praesentium. Inventore repellat aspernatur impedit facere natus vel voluptas. Fugit quod commodi numquam accusamus sequi perspiciatis, minus veniam velit exercitationem quidem aut deserunt vel aliquid! Similique eveniet asperiores quam quaerat natus eius nobis optio nisi corporis quod. Minima at dignissimos culpa voluptatibus nisi consequuntur temporibus cumque assumenda corporis odio debitis neque sapiente laudantium consectetur, libero quis nostrum unde fugiat velit vero perspiciatis cum distinctio sit. Eaque voluptatum aliquid nemo. Consequatur placeat ea minus.</p>
            </div>
            <div className="msg_time">
              <span>11:20am</span>
            </div>
          </div>
          <div className="receptor_img" >
            <img src={magicbara} alt="" />
          </div>
        </div>
      </div>
      <div className="chat_bar" >
        <div className="chat_options">
          <button><AttachFileIcon></AttachFileIcon></button>
        </div>
        <input type="text" placeholder='Escribe Aqui' />
          <button className="btn" onClick={enviar}>Enviar <SendIcon></SendIcon></button>
      </div>

    </div>
  )
}

export default chat
