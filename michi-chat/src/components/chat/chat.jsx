import React from 'react'
import './chat.css'
import elgato from '../../assets/pictures/elgato.png'
function chat() {
  return (
    <div className='chat'>
      <div className="chat-name">
        <h2>el gato</h2>
      </div>

      <div className="chat-content">
        <div className="chat-receptor">
          <div className="profile">
            <img src={elgato} alt="uwu" />
          </div>
          <div className="texto">
            <p>ESTOY MAMADISIMO WEY</p>
            <img src={elgato} alt="" />
            <br />
            <span className="time">11:02</span>
          </div>
        </div>
        <div className="chat-receptor">
          <div className="profile">
            <img src={elgato} alt="uwu" />
          </div>
          <div className="texto">
            <p>ESTOY MAMADISIMO WEY</p>
            <img src={elgato} alt="" />
            <br />
            <span className="time">11:02</span>
          </div>
        </div>
      </div>

      <div className='chat-bar'>
        <div className="chat_options">
          <button>Imagen</button>
          <button>Tareas</button>
        </div>
        <input type="text" placeholder='Escribe un mensaje' />
        <button>Enviar</button>
      </div>
    </div>
  )
}

export default chat
