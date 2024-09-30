import React from 'react';
import './chatBox.css';
import { Box, Typography, Avatar } from '@mui/material';

function chatBox({ chatName, chatPicture, lastMessage, time, seen=false }) {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          borderBottom: '4px dashed var(--color-primary)',
          height: '100%',
          maxWidth: '30vw',
          '&:hover': { backgroundColor: 'var(--color-active-secondary)', cursor: 'pointer' },
        }}
      >
        <div className='chat-box-pfp'>
          <Avatar sx={{ height: '60px', width: '60px' }} src={chatPicture} alt="Logo" />
          <Typography variant="h5" sx={{ marginLeft: '20px' }}>
            {chatName || "uwu"}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              marginLeft: '20px',
              fontSize: '18px',
              color: 'gray',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '15vw', // Puedes ajustar el ancho según necesites
            }}
          >
            {lastMessage} 
          </Typography>
          <span style={{ marginLeft: '10px' }}>{time}</span>
          {!seen == true ? (<div className="circle"></div>): (<div></div>)}
        </div>
      </Box>
    </div>
  );
}

export default chatBox;
