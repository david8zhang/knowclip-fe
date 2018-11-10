import React from 'react'
import './side-window.css'

export const SideWindow = ({ children, onClose }) => {
  return (
    <div className='sideWindow'>
      <p
        className='closeText'
        onClick={() => onClose()}
      >
        Close
      </p>
      { children }
    </div>
  )
}
