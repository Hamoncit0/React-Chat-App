import React from 'react'
import elgato from '../../assets/pictures/elgato.png'

function receivedMessage({msgImg, msgText, msgTime, userImg}) {
  return (
    <div className="msg">
          <div className="receptor_img">
            <img src={userImg || elgato} alt="" />
          </div>
          <div className="msg_content">
            <div className="msg_text">
              <p>{msgText}</p>
            </div>
            {msgImg ? (
            <img src={msgImg} alt="" />):(<div></div>)}
            <div className="msg_time">
              <span>{msgTime}</span>
            </div>
          </div>
    </div>
  )
}

export default receivedMessage
