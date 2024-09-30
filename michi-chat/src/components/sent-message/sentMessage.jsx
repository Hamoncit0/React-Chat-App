import React from 'react'
import magicbara from '../../assets/pictures/magicbara.png'

function sentMessage({msgImg, msgText, msgTime, userImg}) {
  return (
    <div className="msg-sender">
          <div className="msg_content_sender">
            <div className="msg_text">
              <p>{msgText}</p>
            </div>
            {msgImg ? (
            <img src={msgImg} alt="" />):(<div></div>)}
            <div className="msg_time">
              <span>{msgTime}</span>
            </div>
          </div>
          <div className="receptor_img" >
            <img src={userImg || magicbara} alt="" />
          </div>
    </div>
  )
}

export default sentMessage
