import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'; 
import './notification.css'
function Notification() {
  return (
    <div className="Notification">
      <ToastContainer position="top-center">

      </ToastContainer>
    </div>
  )
}

export default Notification
