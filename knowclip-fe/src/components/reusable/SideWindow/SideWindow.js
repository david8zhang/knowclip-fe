import React from 'react'
import './side-window.css'

export const SideWindow = ({ children, onClose }) => {
  return (
    <div className='sideWindow'>
      {/* <i
        onClick={() => onClose()}
        className='fas fa-times closeIcon'
      /> */}
      <p
        onClick={() => onClose()}
        className='closeIcon'
      >
        Close
      </p>
      { children }
    </div>
  )
}
