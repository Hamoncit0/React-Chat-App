import React from 'react';
import './chatBox.css';
import { Box, Typography, Avatar } from '@mui/material';
import magicbara from '../../assets/pictures/elgato.png';
import monedita from '../../assets/moneditas.png';
import patito from '../../assets/sombreritos/patito.png';
import santahat from '../../assets/sombreritos/santahat.png';
import cuernos from '../../assets/sombreritos/cuernos.png';
import michiorejas from '../../assets/sombreritos/michiorejas.png';
import chefhat from '../../assets/sombreritos/chefhat.png';

function chatBox({ chatName, chatPicture, lastMessage, time, seen=false, activeHat }) {
  const hats = [
    { id: 'patito', name: 'Patito', price: 10, image: patito },
    { id: 'santahat', name: 'Santa', price: 10, image: santahat },
    { id: 'cuernos', name: 'Bisonte', price: 10, image: cuernos },
    { id: 'michiorejas', name: 'Egirl', price: 10, image: michiorejas },
    { id: 'chefhat', name: 'Let him cook', price: 10, image: chefhat }
  ];

  const activeHatImage = hats.find(hat => hat.id === activeHat)?.image;

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
          {activeHatImage && (
            <img src={activeHatImage} alt="Active Hat" className='activeHat' />
          )}
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
