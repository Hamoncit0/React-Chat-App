import React from 'react'
import './chatBox.css'
import elgato from '../../assets/pictures/elgato.png'
import guionkuna from '../../assets/pictures/images.jpg'
import capy from '../../assets/pictures/capybara.jpg'
import { Box, Typography, Avatar } from '@mui/material';

function chatBox(chatName, chatPicture) {
  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '4px dashed var(--color-primary)', height: '10vh', '&:hover': { backgroundColor: 'var(--color-active-secondary)', cursor:'pointer'} }}>
          <Avatar sx={{height: '60px', width: '60px'}} src={elgato} alt="Logo" />
          <Typography variant="h5" sx={{ marginLeft: '20px' }}>
            el gato
          </Typography>
      </Box>
    </div>
  )
}

export default chatBox