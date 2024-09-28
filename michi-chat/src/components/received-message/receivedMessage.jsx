import React from 'react'
import magicbara from '../../assets/pictures/magicbara.png'

function receivedMessage() {
  return (
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
  )
}

export default receivedMessage
