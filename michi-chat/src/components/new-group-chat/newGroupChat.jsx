import React, { useState } from 'react';
import './newGroupChat.css';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

function newGroupChat({ isOpen, closeModal, children }) {
  return (
    <div className='new-group-chat'>
      <div className='new-chat-search'>
        <TextField
          
          placeholder='Search...'
          className='custom-input'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ fontSize: 40 }} />
              </InputAdornment>
            ),
          }}
          variant='outlined'
        />
        <div className='close'>
          <button className='close_button' onClick={closeModal}>
            <CloseIcon fontSize='medium' />
          </button>
        </div>
      </div>
      <div className='new-groupchat-list'>
        <div className='new-groupchat-item'>
          <img src={'src/assets/pictures/avatar-blank.png'} alt='' />
          <h2>Username</h2>
          <button className='btn'><AddIcon></AddIcon></button>
        </div>
        <div className='new-groupchat-item'>
          <img src={'src/assets/pictures/avatar-blank.png'} alt='' />
          <h2>Username</h2>
          <button className='btn'><AddIcon></AddIcon></button>
        </div>
        <div className='new-groupchat-item'>
          <img src={'src/assets/pictures/avatar-blank.png'} alt='' />
          <h2>Username</h2>
          <button className='btn'><AddIcon></AddIcon></button>
        </div>
        <div className='new-groupchat-item'>
          <img src={'src/assets/pictures/avatar-blank.png'} alt='' />
          <h2>Username</h2>
          <button className='btn'><AddIcon></AddIcon></button>
        </div>
        <div className='new-groupchat-item'>
          <img src={'src/assets/pictures/avatar-blank.png'} alt='' />
          <h2>Username</h2>
          <button className='btn'><AddIcon></AddIcon></button>
        </div>
      </div>
      <div className="new-group-list">
        <div className="items">
          <div className="gc-new-item">
            <h4>Username1</h4>
            <CloseIcon className='btn-cerrar'></CloseIcon>
          </div>
          <div className="gc-new-item">
            <h4>Username1</h4>
            <CloseIcon className='btn-cerrar'></CloseIcon>
          </div>
          <div className="gc-new-item">
            <h4>Username1</h4>
            <CloseIcon className='btn-cerrar'></CloseIcon>
          </div>
          <div className="gc-new-item">
            <h4>Username1</h4>
            <CloseIcon className='btn-cerrar'></CloseIcon>
          </div>
          <div className="gc-new-item">
            <h4>Username1</h4>
            <CloseIcon className='btn-cerrar'></CloseIcon>
          </div>
        </div>
          <button className='btn'>Crear groupchat</button>
      </div>
    </div>
  )
}

export default newGroupChat
