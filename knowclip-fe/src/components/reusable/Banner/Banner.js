import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../../../constants/colors'
import './banner.css';

export const Banner = ({ type, text, onClose }) => {
  return (
    <div
      id='bannerElement'
      className='banner'
      style={{
        backgroundColor: type === 'success' ? Colors.green : Colors.red
      }}
    >
      <p>{ text }</p>
      <FontAwesomeIcon
        icon={faTimes}
        style={{
          fontSize: '15px',
          color:'white',
          cursor: 'pointer',
          float: 'right',
          marginRight: '20px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
        onClick={onClose}
      />
    </div>
  )
}