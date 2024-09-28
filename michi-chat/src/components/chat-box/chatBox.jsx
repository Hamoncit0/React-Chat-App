import React from 'react'
import './chatBox.css'
import elgato from '../../assets/pictures/elgato.png'
import { Box, Typography, Avatar } from '@mui/material';

function chatBox({chatName, chatPicture, select}) {
  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '4px dashed var(--color-primary)', height: '10vh', '&:hover': { backgroundColor: 'var(--color-active-secondary)', cursor:'pointer'} }}>
          <Avatar sx={{height: '60px', width: '60px'}} src={chatPicture} alt="Logo" />
          <Typography variant="h5" sx={{ marginLeft: '20px' }}>
            {chatName || "uwu"}
          </Typography>
      </Box>
    </div>
  )
}

export default chatBox