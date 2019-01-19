import React from 'react';
import './Button.module.css';

export const Button = ({ onClick, buttonText, style }) => (
  <button
    style={style}
    className='button'
    onClick={() => onClick()}
  >
    { buttonText }
  </button>
);
