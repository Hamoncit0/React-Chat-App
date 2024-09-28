import React from 'react'
import elgato from '../../assets/pictures/elgato.png'

function sentMessage() {
  return (
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
  )
}

export default sentMessage
