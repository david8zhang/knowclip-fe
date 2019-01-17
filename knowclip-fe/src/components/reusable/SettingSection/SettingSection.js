import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import './setting-section.css';

export const SettingSection = ({ title, children }) => {
  return (
    <div className='sectionWrapper'>
      <div className='titleSection'>
        <p>{title}</p>
      </div>
      <div className='optionSection'>
        { children }
        <FontAwesomeIcon
          onClick={() => console.log('Clicked help!')}
          style={{ fontSize: '15px', color: '#555', marginLeft: '10px', cursor: 'pointer' }}
          icon={faQuestionCircle}
        />
      </div>
    </div>
  )
}