import React from 'react'
import './header.css'
import logo from '../../assets/logo_medium.png'
import elgato from '../../assets/pictures/elgato.png'
import pictuere from '../../assets/pictures/magicbara.png'
function header() {
  return (
    <div className="header">
        <img className='header_logo' src={logo} alt="michi chat logo" />
        <div className='profile_picture'>
          <img  src={pictuere} alt="" />
          <div className="status_circle">
          </div>
        </div>
    </div>
  )
}

export default header
