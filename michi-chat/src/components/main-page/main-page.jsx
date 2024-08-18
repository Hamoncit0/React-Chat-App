import React from 'react'
import './main-page.css'
import Chat from '../chat/chat'

import elgato from '../../assets/pictures/elgato.png'
import guionkuna from '../../assets/pictures/images.jpg'
import capy from '../../assets/pictures/capybara.jpg'
import { Box, Typography, Avatar } from '@mui/material';
import Header from '../header/header'

function mainPage() {
  return (
    <div className='mainpage'>
      <div>
        <Header></Header>
      </div>
      <div className="main">
        
      <div className="chat_list">
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '4px dashed #9bb3e8', height: '10vh' }}>
          <Avatar sx={{height: '60px', width: '60px'}} src={elgato} alt="Logo" />
          <Typography variant="h5" sx={{ marginLeft: '20px' }}>
            el gato
          </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '4px dashed #9bb3e8', height: '10vh' }}>
          <Avatar sx={{height: '60px', width: '60px'}} src={guionkuna} alt="Logo" />
          <Typography variant="h5" sx={{ marginLeft: '20px' }}>
            guionkuna
          </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '4px dashed #9bb3e8', height: '10vh' }}>
          <Avatar sx={{height: '60px', width: '60px'}} src={capy} alt="Logo" />
          <Typography variant="h5" sx={{ marginLeft: '20px' }}>
            gort
          </Typography>
          </Box>
        </div>

        <div className="chat_space">
          <Chat></Chat>
        </div>
      </div>
    </div>
  )
}

export default mainPage
