import React from 'react';
import './Button.module.css';

export const Button = ({ onClick, buttonText }) => (
  <button 
    className='button'
    onClick={() => onClick()}
  >
    { buttonText }
  </button>
);
