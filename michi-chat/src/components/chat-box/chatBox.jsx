import React from 'react'
import './chatBox.css'
import elgato from '../../assets/pictures/elgato.png'
import { Box, Typography, Avatar } from '@mui/material';

function chatBox({chatName, chatPicture, lastMessage, time}) {
  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', padding: '10px', borderBottom: '4px dashed var(--color-primary)', height: '100%', maxWidth: '30vw', '&:hover': { backgroundColor: 'var(--color-active-secondary)', cursor:'pointer'} }}>
          <div className='chat-box-pfp'>
            <Avatar sx={{height: '60px', width: '60px'}} src={chatPicture} alt="Logo" />
            <Typography variant="h5" sx={{ marginLeft: '20px' }}>
              {chatName || "uwu"}
            </Typography>
           
            <Typography variant="h5" sx={{ marginLeft: '20px', fontSize: '18px', color:'gray', textOverflow: 'ellipsis'}}>
              {lastMessage} {time}
            </Typography>
          </div>
      </Box>
    </div>
  )
}

export default chatBox