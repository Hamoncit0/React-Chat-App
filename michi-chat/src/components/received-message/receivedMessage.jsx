import React from 'react'
import elgato from '../../assets/pictures/elgato.png'

function ReceivedMessage({ msgImg, msgText, msgLocation, msgTime, userImg }) {
  return (
    <div className="msg">
      <div className="receptor_img">
        <img src={userImg || elgato} alt="Avatar" />
      </div>
      <div className="msg_content">
        <div className="msg_text">
          <p>{msgText}</p>
        </div>
        {msgImg ? (
          <img src={msgImg} alt="Mensaje adjunto" />
        ) : (
          <div></div>
        )}
        {/* Mostrar el mapa si msgLocation está presente */}
        {msgLocation && (
          <iframe
            src={`https://maps.google.com/maps?q=${msgLocation.latitude},${msgLocation.longitude}&z=15&output=embed`}
            width="100%"
            height="200"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            title="Ubicación recibida"
          />
        )}
        <div className="msg_time">
          <span>{msgTime}</span>
        </div>
      </div>
    </div>
  )
}

export default ReceivedMessage;